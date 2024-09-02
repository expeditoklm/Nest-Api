import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { SignUpDto } from './dto/signupDto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signinDto';
import { ResetPasswordDemandDto } from './dto/resetPasswordDemandDto';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmationDto';
import { AuthGuard } from '@nestjs/passport';
import {Request} from 'express' ;
import { DeletedAccountDtoDto } from './dto/deletedAccountDto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService) {}
    @Post('signup')
    signUp(@Body() signUpDto : SignUpDto) {
        return this.authService.signUp(signUpDto)
    }
    @Post('signin')
    signIn(@Body() signInDto : SignInDto) {
        return this.authService.signIn(signInDto)
    }

    @Post('reset-password')
    resetPasswordDemand(@Body() resetPasswordDemandDto : ResetPasswordDemandDto) {
        return this.authService.resetPasswordDemand(resetPasswordDemandDto)
    }

    @Post('reset-password-confirmation')
    resetPasswordConfirmation(@Body() resetPasswordConfirmationDto : ResetPasswordConfirmationDto) {
        return this.authService.resetPasswordConfirmation(resetPasswordConfirmationDto)
    }


    @UseGuards(AuthGuard('jwt'))
    @Delete ('delete')
    deleteAccount(@Req() request :Request , @Body() deletedAccountDto : DeletedAccountDtoDto) {
        const userId = request.user['userId'] ;
    return this.authService.deletedAccount(userId,deletedAccountDto)
    }
}
