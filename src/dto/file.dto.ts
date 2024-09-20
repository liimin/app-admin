import {  IsNumber, IsNotEmpty, ValidateIf, IsInt, Matches, isString,  } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

export class FileDto {
  @ApiProperty({
    type: Number,
    description: '文件记录表主键Id',
    default: 0
  })
  @Transform(({ value }) => (isString(value) && !isNaN(Number(value)) ? value : undefined), {
    toClassOnly: true,
  })
  @Matches(/[0-9]+$/, { message: 'id must be a numeric string' })
  @IsNotEmpty({ message: 'id不能为空' })
  id: number | string

}
