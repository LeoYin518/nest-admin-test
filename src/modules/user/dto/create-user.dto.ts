import { IsNotEmpty, Length } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({ message: "账号不能为空" })
    @Length(1, 5, { message: "账号长度必须在1-5之间" })
    username!: string;
    @IsNotEmpty({ message: "密码不能为空" })
    @Length(1, 5, { message: "密码长度必须在1-5之间" })
    password!: string;
}
