import Email from "../../models/Email";
import AppError from "../../errors/AppError";


    const ShowCapaignEmailService = async (id: string | number): Promise<Email> => {
        const record = await Email.findByPk(id);
      
        if (!record) {
          throw new AppError("ERR_NO_EMAIL_FOUND", 404);
        }
      
        return record;
      };

export default ShowCapaignEmailService;
