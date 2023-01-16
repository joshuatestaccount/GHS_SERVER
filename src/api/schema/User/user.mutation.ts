import { extendType, idArg, inputObjectType, intArg, list, nonNull, stringArg } from 'nexus'
import bcrypt from 'bcryptjs'
import { prisma, pubsub } from '../../../server.js'
import signature, { JwtPayload } from 'jsonwebtoken'
import { GraphQLError } from 'graphql'
import { Dates } from '../../helpers/dateFormat.js'
import { GESend } from '../../helpers/email.js'

const { sign, verify } = signature


export const userInputType = inputObjectType({
    name: "AuthInput",
    definition(t) {
        t.email("email");
        t.string("password");
    },
})

export const userMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("createAdministrator", {
            type: "user",
            args: { companyName: nonNull(stringArg()), Auth: "AuthInput", Profile: "ProfileInput" },
            resolve: async (_, { companyName, Auth: { email, password }, Profile: { firstname, lastname, birthday, phone } }): Promise<any> => {
                const pass = await bcrypt.hash(password, 12)
                return await prisma.$transaction(async (): Promise<any> => {

                    const user = await prisma.user.create({
                        data: {
                            email, password: pass,
                            role: "administrator",
                            createdAt: Dates, updatedAt: Dates,
                            Company: {
                                create: {
                                    companyName,
                                },
                            }
                        },
                    })
                    await prisma.profile.create({
                        data: {
                            firstname, lastname, phone, birthday, User: {
                                connect: {
                                    userID: user.userID
                                },
                            },
                        }
                    })

                    pubsub.publish("createUser", user)
                    return user

                })
            }
        })
        // admin side
        t.field("createAccount", {
            type: "user",
            args: {
                auth: "AuthInput", role: nonNull(stringArg()), Profile: "ProfileInput", companyName: stringArg()
            },
            resolve: async (_, { auth: { email, password }, Profile: { firstname, lastname, birthday, phone }, role, companyName }, { req }): Promise<any> => {
                const token = req.cookies[ "ghs_access_token" ];
                const { userID, role: roles } = verify(token, "HeadStart") as JwtPayload
                if (userID && roles === "administrator") {
                    const pass = await bcrypt.hash(password, 12)
                    const users = await prisma.user.findUnique({
                        where: {
                            userID
                        },
                        include: {
                            Company: true
                        }
                    })
                    if (role === "employer") {
                        return await prisma.user.create({
                            data: {
                                email, password: pass, role: role as any,
                                Profile: {
                                    create: {
                                        firstname, lastname, birthday, phone
                                    }
                                },
                                Company: {
                                    create: {
                                        companyName
                                    }
                                },

                                createdAt: Dates, updatedAt: Dates,
                            }
                        })
                    } else {
                        return await prisma.user.create({
                            data: {
                                email, password: pass, role: role as any,
                                Profile: {
                                    create: {
                                        firstname, lastname, birthday, phone
                                    }
                                },
                                Company: {
                                    connect: {
                                        companyID: users.companyID
                                    }
                                },

                                createdAt: Dates, updatedAt: Dates,
                            }
                        })
                    }
                }
            }
        })
        t.field("login", {
            type: "token",
            args: { Auth: "AuthInput" },
            resolve: async (_, { Auth: { email, password } }, { res }): Promise<any> => {
                const user = await prisma.user.findUnique({
                    where: {
                        email
                    },
                    include: {
                        Profile: true
                    }
                })

                if (!user) throw new GraphQLError("Email address is not found")
                const valid = await bcrypt.compare(password, user.password)
                if (!valid) throw new GraphQLError("Invalid Credentials");

                const token = sign({ userID: user.userID, role: user.role }, "HeadStart", {
                    algorithm: "HS512",
                    expiresIn: "7d",
                    noTimestamp: false,
                })

                const accessToken = sign({ userID: user.userID, role: user.role }, "HeadStart", {
                    algorithm: "HS512",
                    expiresIn: "7d",
                    noTimestamp: false,
                })

                res.cookie("ghs_access_token", accessToken, {
                    httpOnly: false,
                    sameSite: "none",
                    secure: true
                })


                await prisma.logs.create({
                    data: {
                        title: "Logged in",
                        modifiedBy: `${user.Profile.firstname} ${user.Profile.lastname}`,
                        User: {
                            connect: {
                                userID: user.userID
                            }
                        },
                        createdAt: Dates,
                    }
                })

                return { token }
            }
        })
        t.field("updateAllContentUserProfile", {
            type: "user",
            args: { userID: nonNull(idArg()), profile: "ProfileInput", email: "EmailAddress" },
            resolve: async (_, { profile: { birthday, firstname, lastname, phone }, email, userID }): Promise<any> => {
                return await prisma.$transaction(async () => {
                    return await prisma.user.update({
                        data: {
                            email,
                            updatedAt: Dates,
                            Profile: {
                                update: {
                                    firstname, birthday, lastname, phone
                                }
                            }
                        },
                        where: {
                            userID
                        }
                    })
                })
            }
        })
        t.field("updatePassword", {
            type: "user",
            args: { userID: nonNull(idArg()) },
            resolve: async (_, { userID }, { req }): Promise<any> => {
                const token = req.cookies[ 'ghs_access_token' ];
                const { userID: userIds, role } = verify(token, "HeadStart") as JwtPayload

                if (userIds && role === "administrator" || "manager") {
                    const findUser = await prisma.user.findUnique({
                        where: {
                            userID: userIds
                        },
                        include: {
                            Profile: true
                        }
                    })


                    const resetUserpass = await prisma.user.findUnique({
                        where: {
                            userID
                        },
                        include: {
                            Profile: true
                        }
                    })

                    console.log(findUser)

                    const pass = await bcrypt.hash(new Date(resetUserpass.Profile.birthday).toISOString().slice(0, 10).replaceAll("-", ""), 12)

                    return prisma.$transaction(async () => {
                        const userPass = await prisma.user.update({
                            where: { userID },
                            data: {
                                password: pass,
                                updatedAt: Dates
                            }
                        })

                        GESend(userPass.email, "Your password has been reset. Your initial password is your birthday. Format example YYYYMMDD ", "Changed Password")

                        await prisma.logs.create({
                            data: {
                                title: "Changed Password",
                                modifiedBy: `${findUser.Profile.firstname} ${findUser.Profile.lastname}`,
                                createdAt: Dates,
                                User: {
                                    connect: {
                                        userID
                                    }
                                }
                            }
                        })
                        return userPass
                    })
                }



            }
        })
        t.field("changeEmailAddress", {
            type: "user",
            args: { email: nonNull("EmailAddress"), retype: "EmailAddress", userID: nonNull(idArg()) },
            resolve: async (_, { email, retype, userID }): Promise<any> => {
                if (email !== retype) throw new GraphQLError("Email Address is not matched")
                return await prisma.user.update({
                    data: {
                        email
                    },
                    where: {
                        userID
                    }
                })
            }

        })
        t.field("updateUserPassword", {
            type: "user",
            args: {
                password: nonNull(stringArg()), retype: nonNull(stringArg()), userID: nonNull(idArg())
            },
            resolve: async (_, { password, retype, userID }): Promise<any> => {
                if (password !== retype) throw new GraphQLError("Password is not Matched")
                const pass = await bcrypt.hash(password, 12);
                const user = await prisma.user.update({
                    data: {
                        password: pass
                    },
                    where: {
                        userID
                    },
                    include: {
                        Profile: true
                    }
                })

                await prisma.logs.create({
                    data: {
                        title: "You Changed your password",
                        createdAt: Dates,
                        modifiedBy: `${user.Profile.firstname} ${user.Profile.lastname}`,
                        User: {
                            connect: {
                                userID
                            }
                        }
                    }
                })
                return user
            }
        })
        t.field("deleteUser", {
            type: "user",
            args: { userID: nonNull(idArg()) },
            resolve: async (_, { userID }, { req }): Promise<any> => {
                const token = req.cookies[ "ghs_access_token" ]
                const { userID: usersID, role } = verify(token, "HeadStart") as JwtPayload
                if (usersID && role === "administrator" || "manager") {
                    return await prisma.user.delete({
                        where: {
                            userID
                        }
                    })
                }
            }
        })
    },
})