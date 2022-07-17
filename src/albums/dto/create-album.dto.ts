import {IsNotEmpty, IsString, IsNumber, IsUUID, IsOptional} from 'class-validator';

export class CreateAlbumDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    year: number;

    @IsOptional()
    @IsUUID('4')
    artistId: string | null;
}
