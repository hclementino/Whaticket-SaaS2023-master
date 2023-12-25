import { createHash, generateKeyPairSync } from 'crypto';
import SignEmail from "../../models/SignEmail";
import Email from '../../models/Email';

interface Dkim {
  domain: string;
  companyId: number;
}

const GenerateDkimKeys = async (data: Dkim) => {

  const exist = await SignEmail.findOne({
    where: {
      companyId: data.companyId
    }
  });
  if(!exist){
  try {



    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    const formattedPublicKey = publicKey
      .replace(/(\r\n|\n|\r)/gm, '')
      .replace(/-{5}BEGIN PUBLIC KEY-{5}|-{5}END PUBLIC KEY-{5}/g, '')
      .trim();

    const formattedPrivateKey = privateKey
      .replace(/(\r\n|\n|\r)/gm, '')
      .replace(/-{5}BEGIN PRIVATE KEY-{5}|-{5}END PRIVATE KEY-{5}/g, '')
      .trim();

    const dkim = `v=DKIM1; k=rsa; p=${formattedPublicKey}; s=mail; d=${data.domain}`;

    const record = await SignEmail.create({
      publicKey: formattedPublicKey,
      privateKey: formattedPrivateKey,
      dkim,
      companyId: data.companyId,
    });

    return record;
  } catch (error) {
    console.error('Erro ao gerar chaves DKIM:', error);
    throw error;
  }
}else{
  return exist.dkim;
}
};

export default GenerateDkimKeys;
