import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Document } from "src/entities/document.entity";
import { DocumentService } from "./document.service";
import { DocumentController } from "./document.controller";

@Module(
    {
        imports:[TypeOrmModule.forFeature([Document, User])],
        controllers: [DocumentController],
        providers: [DocumentService],
    }
)
export class DocumentModule {
    
}