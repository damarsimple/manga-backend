import { objectType, extendType, stringArg, nonNull } from 'nexus';
import { verify } from '../modules/Hash';
import { createToken } from '../modules/JWT';
export const AuthResponse = objectType({
    name: 'AuthResponse',
    definition(t) {

        t.boolean('status');
        t.nullable.string('token');
        t.nullable.string('message');
        t.nullable.field('user', { type: 'User' });
    }
})

export const AuthQuery = extendType({
    type: 'Query',
    definition(t) {
          t.nullable.field('me', {
            type: 'User',
            resolve: async (_, __, ctx) => {

                if (!ctx.user) return null;

                const user = await ctx.prisma.user.findFirst({
                    where: {
                        email : ctx.user.email
                    }
                })

                return user;
            }
        })
    }
})

export const AuthMutation = extendType({
    type: 'Mutation',
    definition(t) {


        t.field('login', {
            type: AuthResponse,
            args: {
                email: nonNull(stringArg()),
                password: nonNull(stringArg())
            },
            resolve: async (_, { email, password }, ctx) => {

                const user = await ctx.prisma.user.findFirst({
                    where: {
                        email
                    }
                })

                if (!user) {

                    return {
                        status: false,
                        message: "Akun tidak ditemukan ...",
                    }
                }


                if (! await verify(password, user.password)) {
                    return {
                        status: false,
                        message: "Password salah ...",
                    }
                }


                return {
                    status: true,
                    token: createToken(user),
                    user
                }
            }
        })

        t.field('register', {
            type: AuthResponse,
            args: {
                email: nonNull(stringArg()),
                name: nonNull(stringArg()),
                password: nonNull(stringArg())
            },
            resolve: async (_, { email, name, password }, ctx) => {

                const user = await ctx.prisma.user.findFirst({
                    where: {
                        email
                    }
                })

                if (user) {

                    return {
                        status: false,
                        message: "Akun sudah terdaftar",
                    }
                }

                const newUser = await ctx.prisma.user.create({
                    data: {
                        email,
                        name,
                        password: await createToken(password)
                    }
                })


                return {
                    status: true,
                    token: createToken(newUser),
                    user: newUser
                }
            }
        })

    }
})