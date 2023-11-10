import SearchService from "../services/SearchService";
import { Request, Response, NextFunction } from "express";

const searchService = new SearchService();

export const findUsersAndGroups = async (req: Request, res: Response, next: NextFunction) => {
    const { search } = req.query;
    try {
      const users = await searchService.findUsersAndGroups(search);
      return res.status(201).json(users);
    } catch (error) {
      next(error);
    }
};