import { FastifyReply, FastifyRequest } from 'fastify';
import * as ClassementTeamService from '../services/classementTeam.service';

export const createClassement = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const data = req.body as any;
    const classement = await ClassementTeamService.createClassement(data);
    res.code(201).send(classement);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.code(400).send({ 
        error: 'Conflit de données', 
        message: 'Cette équipe a déjà un classement pour cette saison ou cette position est déjà prise' 
      });
    } else {
      res.code(500).send({ 
        error: 'Erreur lors de la création du classement équipe',
        message: error.message 
      });
    }
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
    
    const classements = await ClassementTeamService.getClassementBySeason(seasonNumber);
    
    if (classements.length === 0) {
      return res.code(404).send({
        error: 'Aucun classement équipe disponible',
        message: `Désolé, aucun classement équipe n'est disponible pour la saison ${season}. Veuillez vérifier l'année ou consulter les saisons disponibles.`
      });
    }
    
    res.send({
      season: seasonNumber,
      totalTeams: classements.length,
      classements
    });
  } catch (error: any) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération du classement équipe de la saison',
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
    
    const stats = await ClassementTeamService.getSeasonStats(seasonNumber);
    
    if (!stats) {
      return res.code(404).send({
        error: 'Aucune statistique équipe disponible',
        message: `Désolé, aucune donnée équipe n'est disponible pour la saison ${season}`
      });
    }
    
    res.send(stats);
  } catch (error: any) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération des statistiques équipes',
      message: error.message 
    });
  }
};

export const getTeamPosition = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { teamId, season } = req.params as { teamId: string; season: string };
    const teamIdNumber = Number(teamId);
    const seasonNumber = Number(season);
    
    if (isNaN(teamIdNumber) || isNaN(seasonNumber)) {
      return res.code(400).send({
        error: 'Paramètres invalides',
        message: 'L\'ID de l\'équipe et la saison doivent être des nombres valides'
      });
    }
    
    const position = await ClassementTeamService.getTeamPosition(teamIdNumber, seasonNumber);
    
    if (!position) {
      return res.code(404).send({
        error: 'Position équipe introuvable',
        message: `Aucune position trouvée pour l'équipe ${teamId} en ${season}`
      });
    }
    
    res.send(position);
  } catch (error: any) {
    res.code(500).send({ 
      error: 'Erreur lors de la récupération de la position équipe',
      message: error.message 
    });
  }
};

export const updateClassement = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    const data = req.body as any;
    const classement = await ClassementTeamService.updateClassement(Number(id), data);
    res.send(classement);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.code(404).send({ 
        error: 'Classement équipe introuvable',
        message: `Aucun classement équipe trouvé avec l'ID` 
      });
    } else if (error.code === 'P2002') {
      res.code(400).send({ 
        error: 'Conflit de données', 
        message: 'Cette position équipe est déjà prise pour cette saison' 
      });
    } else {
      res.code(500).send({ 
        error: 'Erreur lors de la mise à jour du classement équipe',
        message: error.message 
      });
    }
  }
};

export const deleteClassement = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    await ClassementTeamService.deleteClassement(Number(id));
    res.code(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.code(404).send({ 
        error: 'Classement équipe introuvable',
        message: `Aucun classement équipe trouvé avec l'ID` 
      });
    } else {
      res.code(500).send({ 
        error: 'Erreur lors de la suppression du classement équipe',
        message: error.message 
      });
    }
  }
};