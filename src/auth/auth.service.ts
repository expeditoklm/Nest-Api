import { Body, ConflictException, Injectable, Post, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/signupDto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { MailerService } from 'src/mailer/mailer.service';
import { SignInDto } from './dto/signinDto';
import { JwtService } from '@nestjs/jwt';
import { subscribe } from 'diagnostics_channel';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemandDto';
import * as speakeasy from 'speakeasy';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmationDto';
import { DeletedAccountDtoDto } from './dto/deletedAccountDto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService : PrismaService,
        private readonly emailService : MailerService ,
        private readonly jwtService : JwtService,
        private readonly configService : ConfigService   
    ) {}
    async signUp(signUpDto : SignUpDto) {
        const { password, email , userName} = signUpDto;
        const user = await this.prismaService.user.findUnique({ where : { email : signUpDto.email } });
        if(user) throw new ConflictException('User already exists');
        const hashPassword = await bcrypt.hash(password, 10)
        await this.prismaService.user.create({ data : {userName, email, password : hashPassword  } })

        await this.emailService.sendSignupConfirmation(email);
        return { data : 'User created successfully'};
    }


     async signIn(signInDto : SignInDto) {

        const { email, password } = signInDto;
        const  user = await this.prismaService.user.findUnique({ where : { email : signInDto.email } });
        if (!user) throw new ConflictException('User does not exist');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');
        const payload = {
            sub : user.userId ,
            email : user.email
        }
        const token = this.jwtService.sign(payload, { expiresIn : '2h',secret : this.configService.get('SECRET_KEY')  });
        return {
            tohen : token,
            user : {
                userName : user.userName,
                email : user.email,
            },
            data : 'User signed in successfully'
        }
    }

    async resetPasswordDemand( resetPasswordDemandDto : ResetPasswordDemandDto) {
        const { email } = resetPasswordDemandDto;
        const  user = await this.prismaService.user.findUnique({ where : { email : resetPasswordDemandDto.email } });
        if (!user) throw new ConflictException('User does not exist');
        const code = speakeasy.totp({ secret : this.configService.get('OTP_CODE'),
            digits : 5,
            step : 60 * 15,
            encoding : 'base32' 
        });
        const url = "http://localhost:3000/auth/reset-password-confirmation"
        await this.emailService.sendResetPassword(email, url, code); //await this.emailService.resetPassword(email, url, speakeasy.totp({ secret : this.configService.get('OTP_CODE') , encoding : 'base32' }));
        return {
            data : "Reset password mail has been sent"
        }
    }

    async resetPasswordConfirmation(@Body() resetPasswordConfirmationDto : ResetPasswordConfirmationDto) {
        const { email, password, code } = resetPasswordConfirmationDto;
        const user = await this.prismaService.user.findUnique({ where : { email : resetPasswordConfirmationDto.email } });
        if (!user) throw new ConflictException('User does not exist');
        const isMatch = await speakeasy.totp.verify({
            secret : this.configService.get('OTP_CODE'),
            token : code,
            encoding : 'base32',
            step : 60 * 15,
            digits : 5,
        });
        if (!isMatch) throw new UnauthorizedException('Invalid code');
        const hashPassword = await bcrypt.hash(password, 10)
        await this.prismaService.user.update({ where : { email : email }, data : { password : hashPassword } })

        return { data : "Password Updated"}
    }


    async deletedAccount( userId : number , deletedAccountDto : DeletedAccountDtoDto) {
        const {password } = deletedAccountDto;
        const user = await this.prismaService.user.findUnique({ where : { userId : userId } });
        if (!user) throw new ConflictException('User does not exist');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');
        await this.prismaService.user.delete({ where : { userId : userId } })

        return { data : "User deleted successfully" } //return data 
  
    }
}
