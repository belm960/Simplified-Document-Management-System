import { Body, Controller, Delete, Get, Param, Post, Put, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { DocumentService } from "./document.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('documents')
export class DocumentController {

    constructor(private readonly documentService: DocumentService){}

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createDocument(@Body() body: any, @Req() req: any){
        const userId = req.user.id
        return this.documentService.createDocument(body.title, body.content, userId)
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    async updateDocument(@Param('id') id: number, @Body() body: any, @Req() req: any){
        const userId = req.user.id
        const isAdmin = req.user.role === 'Admin'
        return this.documentService.updateDocument(+id, body.title, body.content, userId, isAdmin)
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async getDocument(@Param('id') id: number, @Req() req: any){
        const userId = req.user.id
        const isAdmin = req.user.role === 'Admin'
        return this.documentService.getDocument(+id, userId, isAdmin)
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async listDocuments(@Req() req: any){
        const userId = req.user.id
        const isAdmin = req.user.role === 'Admin'
        return this.documentService.listDocuments(userId, isAdmin)
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    async deleteDocument(@Param('id') id: number, @Req() req: any){
        const isAdmin = req.user.role === 'Admin'
        return this.documentService.deleteDocument(+id, isAdmin)
    }



}