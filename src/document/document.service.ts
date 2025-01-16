import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {Document} from "src/entities/document.entity"
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class DocumentService{
    constructor(
        @InjectRepository(Document)
        private documentRepository: Repository<Document>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ){}

    async createDocument(title: string, content: string, ownerId: number): Promise<Document>{
        if(!title || title.length>255){
            throw new Error('Title must not be empty and also must have maximum of 255 characters')
        }
        if(!content){
            throw new Error('Content must not be empty')
        }
        const owner = await this.userRepository.findOneBy({id: ownerId});
        if(!owner) throw new NotFoundException('Owner Not Found!')

        const document = this.documentRepository.create({title, content, owner})
        return this.documentRepository.save(document);
    }

    async updateDocument(id: number, title: string, content: string, userId: number, isAdmin:boolean): Promise<Document>{
        if(!title || title.length>255){
            throw new Error('Title must not be empty and also must have maximum of 255 characters')
        }
        if(!content){
            throw new Error('Content must not be empty')
        }
        const document = await this.documentRepository.findOne({where: {id}, relations: ['owner']})
        if(!document) throw new NotFoundException('Document Not Found')

        if(!isAdmin && document.owner.id !== userId) throw new UnauthorizedException('You do not Own this Document')
        
        document.title = title
        document.content = content

        return this.documentRepository.save(document)
    }

    async getDocument(id: number, userId: number, isAdmin: boolean): Promise<Document>{
        const document = await this.documentRepository.findOne({where: {id}, relations: ['owner']})

        if(!document) throw new NotFoundException('Document was not found')

        if(!isAdmin && document.owner.id !== userId) throw new UnauthorizedException('Access Denied')

        return document
    }

    async listDocuments(userId: number, isAdmin: boolean): Promise<Document[]>{
        if(isAdmin){
            return this.documentRepository.find()
        }else{
            return this.documentRepository.find({where: {owner: {id: userId}}})
        }
    }

    async deleteDocument(id: number, isAdmin:boolean):Promise<void>{
        const document = await this.documentRepository.findOneBy({id})
        if(!document) throw new NotFoundException('Document not found')

        if(!isAdmin) throw new UnauthorizedException('Access Denied')

        await this.documentRepository.remove(document);
    }
}