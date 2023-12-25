import { Request, Response } from "express";
import { getIO } from "../libs/socket";
import fs from 'fs/promises';
import path from 'path'; 
import CreateCampaignService from "../services/CampaignEmailService/CreateCampaignService";
import SimpleListService from "../services/UserServices/SimpleListService";
import ListService from "../services/CampaignEmailService/ListEmailService";
import GenerateDkimKeys from "../services/CampaignEmailService/GenerateDkimService";
import VerifyDkimDNS from "../services/CampaignEmailService/VerifyDkimDns";
import ShowCapaignEmailService from "../services/CampaignEmailService/ShowCapaignEmailService";
import { promises as fsPromises } from 'fs';

interface EmailData {
  name: string;
  from: string;
  companyId: number;
  userQueuesId: number;
}

type IndexQuery = {
  searchParam: string;
  pageNumber: string;
};


export const index = async (req: Request, res: Response): Promise<Response> => {
  const { pageNumber, searchParam} = req.query as IndexQuery;
  const { companyId } = req.user;

  const { email, count, hasMore } = await ListService({
    searchParam,
    pageNumber,
    companyId,
  });

  return res.json({ email, count, hasMore });
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  const record = await ShowCapaignEmailService(id);

  return res.status(200).json(record);
};


export const save = async (req: Request, res: Response): Promise<Response> => {
  const { content, companyId } = req.body;

  try {
    // Criar um nome único para o arquivo (por exemplo, usando um timestamp)
    const timestamp = new Date().getTime();

    // Verificar se o conteúdo começa com <!DOCTYPE>
    const isHtmlContent = content.startsWith('<!DOCTYPE');

    // Caminho completo para o novo arquivo na pasta "templates" ou "templates_html"
    const baseDirectory = isHtmlContent ? 'templates_html' : 'templates';
    const userDirectory = path.join('src/controllers', baseDirectory, companyId.toString());
    const filePath = path.join(userDirectory, `${timestamp}.html`);

    // Criar a pasta se não existir
    await fsPromises.mkdir(userDirectory, { recursive: true });

    // Salvar o conteúdo no novo arquivo
    await fsPromises.writeFile(filePath, content);

    // Notificar clientes usando socket.io
    const io = getIO();
    io.emit('templateUpdated', { message: 'Novo template salvo!' });

    return res.status(200).json({ success: true, message: 'Template salvo com sucesso.' });
  } catch (error) {
    console.error('Erro ao salvar o arquivo:', error);
    return res.status(500).json({ success: false, error: 'Erro ao salvar o arquivo.' });
  }
};


export const generateKey = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { domain, companyId } = req.body;

    if (!domain || !companyId) {
      return res.status(400).json({ error: 'Parâmetros inválidos.' });
    }

    const dkimRecord = await GenerateDkimKeys({ domain, companyId });
    if(dkimRecord){
      return res.status(200).json(dkimRecord);
    }else{
    return res.status(500).json(dkimRecord);
  }
  } catch (error) {
    console.error('Erro no controller GenerateDkimKeysController:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};


export const VerifyDNS = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const dkimRecord = await VerifyDkimDNS(parseInt(id));
    if(dkimRecord.success == true){
    return res.status(200).json(dkimRecord);
    }else{
    return res.status(500).json(dkimRecord);
    }
  } catch (error) {
    console.error('Erro no controller GenerateDkimKeysController:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const saveCampaignEmail = async (req: Request, res: Response): Promise<Response> => {
  const newEmail: EmailData = req.body;

  const contact = await CreateCampaignService({
    ...newEmail,
    name: newEmail.name,
    companyId: newEmail.companyId
  });

  return res.status(200).json(contact);
};
