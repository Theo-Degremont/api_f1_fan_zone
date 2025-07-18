import { FastifyReply, FastifyRequest } from 'fastify';
import * as ClassementDriverService from '../services/classementDriver.service';

export const createClassement = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const data = req.body as any;
    const classement = await ClassementDriverService.createClassement(data);
    res.code(201).send(classement);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.code(400).send({ 
        error: 'Conflit de données', 
        message: 'Ce pilote a déjà un classement pour cette saison ou cette position est déjà prise' 
      });
    } else {
      res.code(500).send({ 
        error: 'Erreur lors de la création du classement',
        message: error.message 
      });
    }
  }
};

export const getAllClassements = async (_req: FastifyRequest, res: FastifyReply) => {
  try {
    const classements = await ClassementDriverService.getAllClassements();
    res.send(classements);
  } catch (error: any) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des classements',
      message: error.message 
    });
  }
};

export const getClassementById = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    const classement = await ClassementDriverService.getClassementById(Number(id));
    
    if (!classement) {
      return res.code(404).send({ 
        error: 'Classement introuvable',
        message: `Aucun classement trouvé avec l'ID ${id}` 
      });
    }
    
    res.send(classement);
  } catch (error: any) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération du classement',
      message: error.message 
    });
  }
};

export const getClassementBySeason = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { season } = req.params as { season: string };
    const seasonNumber = Number(season);
    
    if (isNaN(seasonNumber) || seasonNumber < 1950 || seasonNumber > new Date().getFullYear() + 1) {
      return res.code(400).send({
        error: 'Saison invalide',
        message: `La saison doit être un nombre valide entre 1950 et ${new Date().getFullYear() + 1}`
      });
    }
    
    const classements = await ClassementDriverService.getClassementBySeason(seasonNumber);
    
    if (classements.length === 0) {
      return res.code(404).send({
        error: 'Aucun classement disponible',
        message: `Désolé, aucun classement n'est disponible pour la saison ${season}. Veuillez vérifier l'année ou consulter les saisons disponibles.`
      });
    }
    
    res.send({
      season: seasonNumber,
      totalDrivers: classements.length,
      classements
    });
  } catch (error: any) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération du classement de la saison',
      message: error.message 
    });
  }
};

export const getAvailableSeasons = async (_req: FastifyRequest, res: FastifyReply) => {
  try {
    const seasons = await ClassementDriverService.getAvailableSeasons();
    res.send({
      availableSeasons: seasons,
      total: seasons.length
    });
  } catch (error: any) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des saisons',
      message: error.message 
    });
  }
};

export const getSeasonStats = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { season } = req.params as { season: string };
    const seasonNumber = Number(season);
    
    if (isNaN(seasonNumber)) {
      return res.code(400).send({
        error: 'Saison invalide',
        message: 'La saison doit être un nombre valide'
      });
    }
    
    const stats = await ClassementDriverService.getSeasonStats(seasonNumber);
    
    if (!stats) {
      return res.code(404).send({
        error: 'Aucune statistique disponible',
        message: `Désolé, aucune donnée n'est disponible pour la saison ${season}`
      });
    }
    
    res.send(stats);
  } catch (error: any) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des statistiques',
      message: error.message 
    });
  }
};

export const updateClassement = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    const data = req.body as any;
    const classement = await ClassementDriverService.updateClassement(Number(id), data);
    res.send(classement);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.code(404).send({ 
        error: 'Classement introuvable',
        message: `Aucun classement trouvé avec l'ID ` 
      });
    } else if (error.code === 'P2002') {
      res.code(400).send({ 
        error: 'Conflit de données', 
        message: 'Cette position est déjà prise pour cette saison' 
      });
    } else {
      res.code(500).send({ 
        error: 'Erreur lors de la mise à jour du classement',
        message: error.message 
      });
    }
  }
};

export const deleteClassement = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    await ClassementDriverService.deleteClassement(Number(id));
    res.code(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.code(404).send({ 
        error: 'Classement introuvable',
        message: `Aucun classement trouvé avec l'ID` 
      });
    } else {
      res.code(500).send({ 
        error: 'Erreur lors de la suppression du classement',
        message: error.message 
      });
    }
  }
};