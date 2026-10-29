import { IsNotEmpty, MaxLength, MinLength, IsNumber } from "class-validator"

export class UpdateUserDto {
    @IsNotEmpty({ message: "密码不能为空" })
    @MaxLength(5, { message: "密码长度必须在1-5之间" })
    @MinLength(1, { message: "密码长度必须在1-5之间" })
    password!: string
}
