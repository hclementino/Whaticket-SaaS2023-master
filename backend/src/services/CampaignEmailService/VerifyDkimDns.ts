import dns from 'dns';
import SignEmail from "../../models/SignEmail";

interface DkimVerificationResult {
  success: boolean;
  message?: string;
}

const VerifyDkimDNS = async (id: number): Promise<DkimVerificationResult> => {
    try {
    const dkimRecord = await SignEmail.findOne({
        where: {
             companyId: id
        }
        });
      let dnsRecords;
  
      if (!dkimRecord) {
        return { success: false, message: 'Registro DKIM não encontrado' };
      }
  

      const domainMatch = /d=([^;]+)/.exec(dkimRecord.dkim);
      const domain = domainMatch ? domainMatch[1] : null;


  
      if (!domain) {
        return { success: false, message: 'Erro ao extrair o domínio do registro DKIM' };
      }

      console.log(domain)
  
      try {
        if (!dnsRecords) {
            dnsRecords = await new Promise<string[][]>((resolve, reject) => {
              dns.resolveTxt(domain, (err, records) => {
                if (err) {
                return { success: false, message: 'DNS não cadastrado ou propagado' };
                } else {
                  resolve(records);
                }
              });
            });

            console.log(dnsRecords)
  
        const isDkimConfigured = dnsRecords[0][0];

        console.log(isDkimConfigured)
  
        if (isDkimConfigured != null) {
          return { success: true, message: 'O registro está configurado corretamente no DNS' };
        } else {
          return { success: false, message: 'O registro não foi encontrado no DNS' };
        }
    }
      } catch (dnsError) {
        console.error('Erro ao resolver registros DNS:', dnsError);
        return { success: false, message: 'Erro ao verificar - Problema com registros DNS' };
      }
    } catch (error) {
      console.error('Erro ao verificar DNS:', error);
      return { success: false, message: 'Erro interno ao verificar registro DNS' };
    }
    
  };

export default VerifyDkimDNS;