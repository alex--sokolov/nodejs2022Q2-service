import {IsNotEmpty, IsString, IsNumber, IsUUID, IsOptional} from 'class-validator';

export class CreateTrackDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsUUID('4')
    artistId: string | null;

    @IsOptional()
    @IsUUID('4')
    albumId: string | null;

    @IsNotEmpty()
    @IsNumber()
    duration: number;
}
