import { Response, Request } from 'express';
import Despesa from '../Model/despesaModel';
import { UserService } from '../Service/userService';
import User from '../Model/userModel';
import { DespesaService } from '../Service/despesaService'; 
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

export class DespesaController {
  private despesaService = new DespesaService();
  private userService = new UserService();

  constructor() {
    this.despesaService = new DespesaService();
    this.userService = new UserService();
  }

  async createDespesa(req: Request, res: Response) {
    const { userId } = req.params;
    const despesaBody = req.body;

    try {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({
          error: true,
          code: 404,
          message: `No tutor with id ${userId}`,
        });
      }
      const newDespesa = await this.despesaService.createDespesa(userId, despesaBody); // Aqui é onde ocorre o erro

      return res.status(201).json({ newDespesa, userId: user._id, message: 'Receita criada!' });

    } catch (error) {
      return res.status(400).json({
        error,
        message: "Bad request error",
      });
    }
  }
  async updateDespesa(req: Request, res: Response) {
    const { despesaId } = req.params;
    const updatedData = req.body;

    try {
      const updatedUserData = await this.despesaService.updateDespesa(despesaId, updatedData)

      if (!updatedUserData) {
        return res.status(404).json({ message: 'Id não encontrado' });
      }

      return res.status(200).json({ updatedData, message: 'Despesa atualizada' });
    } catch (error) {
      return res.status(400).json({ error, message: 'Request error' });
    }


  }
  async deleteDespesa(req: Request, res: Response) {
    const { despesaId, userId } = req.params;

    try {
      const user = await this.userService.getUserById(userId);
  
      if (!user) {
          return res.status(404).json({
              error: true,
              message: `Não existe usuário com esse id: ${userId}`,
          });
      }
        
      const deletedUserData = await this.despesaService.deleteDespesa(despesaId, userId);
      if (!deletedUserData) {
          return res.status(404).json({ message: "Não existe despesa" })
      }
  
      return res.status(204).send(); // 204 No Content
  
  } catch (error) {
      console.log(error)
      return res.status(400).json({ error, message: 'Request error' });
  }
  }
  async getDespesaById(req: Request, res: Response){
        const { despesaId } = req.params;
        
        try {
          const despesa = await this.despesaService.getDespesaById(despesaId);
          if(!despesa){
            return res.status(404).json({ message: "Despesa não encontrada" });
          }


          return res.status(200).json(despesa)
        } catch (error) {
          return res.status(400).json({ error, message: "Request error" });
        }



  }

}