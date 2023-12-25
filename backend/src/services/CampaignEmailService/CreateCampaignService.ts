import * as Yup from "yup";
import AppError from "../../errors/AppError";
import Email from "../../models/Email";

interface Data {
  name: string;
  from: string;
  companyId: number;
  userQueuesId: number;
}

const CreateCampaignService = async (data: Data): Promise<Email> => {
  const  name  = data.name;

  const ticketnoteSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "ERR_CAMPAIGN_NAME")
      .required("ERR_CAMPAIGN_NAME_REQUIRED")
  });

  try {
    await ticketnoteSchema.validate({ name });
  } catch (err: any) {
    throw new AppError(err.message);
  }

  const record = await Email.create(data);

  return record;
};

export default CreateCampaignService;
