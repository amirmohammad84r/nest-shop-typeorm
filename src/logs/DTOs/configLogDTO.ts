import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

export class ConfigLogDTO {
    @ApiProperty({
        example: 'item',
        description: 'you should send item or date',
    })
    @IsString()
    @Matches(/^(date|item)$/gmi, { message: `you sould send only "item" or "date" anything else is not valid` })
    type: String;

    @ApiProperty({
        example: '100',
        description: 'you should send rows count or delete after create by day',
    })
    @IsString()
    @Matches(/^\d{2,6}$/, { message: `you sould send the number of days and the count of items that should be beetwin 10 and 999999` })
    secound: String;
}
