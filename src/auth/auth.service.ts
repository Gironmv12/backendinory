import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterEmailDto } from './dto/register-email.dto';
import { ConflictException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AuthProvider } from '@prisma/client';
import { LoginEmailDto } from './dto/login-email.dto';
import { NotFoundException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User } from '@prisma/client';
import { AuthAccount } from '@prisma/client';

//google
import { OAuth2Client } from 'google-auth-library';
import { LoginGoogleDto } from './dto/login-google.dto';

//google client
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

@Injectable()
export class AuthService {
    constructor (
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    // Token generation
    private generateToken(userId: number): string {
        const payload = { sub: userId };
        return this.jwtService.sign(payload);
    }

    // Build AuthResponseDto user object
    private async buildAuthResponse(user: User): Promise<AuthResponseDto> {
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                lastLoginAt: new Date(),
            },
        })
        return {
            accessToken: this.jwtService.sign({ sub: user.id }, { expiresIn: '1h' }),
            refreshToken: this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' }),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                lastLoginAt: new Date(),
            },
        };
    }

    // Registration by email
    async registerEmail(dto: RegisterEmailDto): Promise<AuthResponseDto> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: {
                authAccounts: true,
            },
        })

        if (existingUser) {
            // Check if the user already has an email account
            const emailAccount = existingUser.authAccounts.find(
                account => account.provider === AuthProvider.EMAIL
            );
            
            if (emailAccount) {
                throw new ConflictException('Email already exists with email authentication');
            }

            // Check if user has Google account
            const googleAccount = existingUser.authAccounts.find(
                account => account.provider === AuthProvider.GOOGLE
            );

            if (googleAccount) {
                // Link email account to existing Google user
                await this.prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        authAccounts: {
                            create: {
                                provider: AuthProvider.EMAIL,
                                externalId: dto.email,
                                passwordHash: await bcrypt.hash(dto.password, 10),
                            },
                        },
                    },
                });
                
                return this.buildAuthResponse(existingUser);
            }

            // User exists but with unknown provider
            throw new ConflictException('Email already exists with another authentication provider');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: dto.name,
                role: UserRole.USER,
                emailVerified: false,
                isActive: true,
                authAccounts: {
                    create: {
                        provider: AuthProvider.EMAIL,
                        externalId: dto.email,
                        passwordHash: hashedPassword,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                emailVerified: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
                lastLoginAt: true,
            },
        });

        const accessToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });


        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                lastLoginAt: user.lastLoginAt,
            },
        };
    }

    // Login by email
    async loginEmail(dto: LoginEmailDto): Promise<AuthResponseDto> {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: {
                authAccounts: {
                    where: { provider: AuthProvider.EMAIL },
                },
            },
        });

        if (!user || !user.authAccounts[0]) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.authAccounts[0].passwordHash,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });


        // Update last login time
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });


        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
                isActive: user.isActive,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                lastLoginAt: user.lastLoginAt,
            },
        };
    }

    //login with google
    async loginWithGoogle(dto: LoginGoogleDto): Promise<AuthResponseDto> {
        try{
            if(!GOOGLE_CLIENT_ID){
                throw new UnauthorizedException('Google client ID not found');
            }
            const ticket = await googleClient.verifyIdToken({
                idToken: dto.idToken,
                audience: GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();
            if(!payload)
                throw new UnauthorizedException('Invalid token');

            const {sub: googleId, email, name} = payload;
            if(!googleId || !email || !name){
                throw new UnauthorizedException('Invalid token');
            }

            // Check existing user with this email
            const user = await this.prisma.user.findUnique({
                where: { email },
                include: {
                    authAccounts: true,
                },
            }) as User & { authAccounts: AuthAccount[] };

            if (user) {
                // Check if user already has Google account
                const googleAccount = user.authAccounts.find(
                    account => account.provider === AuthProvider.GOOGLE
                );
                
                if (googleAccount) {
                    // User already has Google account, just verify the ID
                    if (googleAccount.externalId !== googleId) {
                        throw new ConflictException('Google account exists but with different ID');
                    }
                    
                    // Return existing user with Google auth
                    return this.buildAuthResponse(user);
                }

                // Check if user has email account
                const emailAccount = user.authAccounts.find(
                    account => account.provider === AuthProvider.EMAIL
                );

                if (emailAccount) {
                    // User exists with email account, link Google account
                    await this.prisma.user.update({
                        where: { id: user.id },
                        data: {
                            authAccounts: {
                                create: {
                                    provider: AuthProvider.GOOGLE,
                                    externalId: googleId,
                                },
                            },
                        },
                    });
                    
                    return this.buildAuthResponse(user);
                }

                // User exists but with unknown provider
                throw new ConflictException('Email already exists with another authentication provider');
            }

            if (!user) {
                // Create new user
                const newUser = await this.prisma.user.create({
                    data: {
                        email,
                        name,
                        role: UserRole.USER,
                        emailVerified: true,
                        isActive: true,
                        authAccounts: {
                            create: {
                                provider: AuthProvider.GOOGLE,
                                externalId: googleId,
                            },
                        },
                    },
                });

                return this.buildAuthResponse(newUser);
            }

            // If execution reaches here, some unexpected case occurred
            throw new ConflictException('Unhandled Google login scenario');
        }catch(error){
            throw error;
        }
    }
}
