import { IsNotEmpty, Length } from "class-validator"

export class LoginBody {
    @IsNotEmpty({ message: "用户名不能为空" })
    username!: string
    @IsNotEmpty({ message: "用户密码不能为空" })
    @Length(1, 5, { message: "密码1-5位" })
    password!: string
}