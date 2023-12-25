import { Op } from "sequelize";
import Chat from "../../models/Chat";
import ChatUser from "../../models/ChatUser";
import User from "../../models/User";
import Email from "../../models/Email";

interface Request {
    companyId: number;
    searchParam?: string;
    pageNumber?: string | number;
  }

interface Response {
  email: Email[];
  count: number;
  hasMore: boolean;
}

const ListService = async ({
    companyId,
    searchParam,
    pageNumber = "1",
  }: Request): Promise<Response> => {
    let whereCondition = {};
  
      if (searchParam) {
        whereCondition = {
          [Op.or]: [
            { name: { [Op.like]: `%${searchParam}%` } },
            { color: { [Op.like]: `%${searchParam}%` } }
          ]
        };
      }
      const limit = 20;
      const offset = limit * (+pageNumber - 1);
      
      const { count, rows: email } = await Email.findAndCountAll({
        where: { ...whereCondition, companyId },
        limit,
        offset,
        order: [["name", "ASC"]],
        subQuery: false,
        attributes: [
          'id',
          'name',
          'createdAt'
        ],    
      });
  
      const hasMore = count > offset + email.length;
  
      return {
        email,
        count,
        hasMore
    }
  };

export default ListService;
