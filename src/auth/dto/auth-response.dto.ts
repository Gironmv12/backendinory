export class AuthResponseDto {
    accessToken: string;
    refreshToken?: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        emailVerified: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        lastLoginAt?: Date | null;
    }
}
