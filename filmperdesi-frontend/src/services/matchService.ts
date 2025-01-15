import axios from "axios";
import { MatchData, Match } from "../types/match";

const API_URL = "http://localhost:1337/api";

export const saveMatchResult = async (
  matchResult: {
    books: Array<{
      title: string;
      author: string;
      matches: Array<{
        userId: number;
        username: string;
        bookTitle: string;
        bookAuthor: string;
      }>;
    }>;
  },
  token: string,
  userId: number
) => {
  try {
    const response = await axios.post(
      `${API_URL}/matches`,
      {
        data: {
          matchData: matchResult,
          status: "pending",
          user: userId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Eşleşme sonuçları kaydedilemedi:", error);
    throw error;
  }
};

export const saveMatch = async (
  matchData: MatchData,
  token: string,
  userId: number
) => {
  try {
    const response = await axios.post(
      `${API_URL}/matches`,
      {
        data: {
          matchData,
          status: "pending",
          user: userId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Eşleşme kaydedilemedi:", error);
    throw error;
  }
};

export const listMatches = async (token: string): Promise<Match[]> => {
  try {
    const response = await axios.get(`${API_URL}/matches`, {
      params: {
        populate: ["user"],
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data.map((match: any) => ({
      id: match.id,
      books: match.attributes.matchData.books,
      status: match.attributes.status,
      user: match.attributes.user.data.attributes,
      createdAt: match.attributes.createdAt,
    }));
  } catch (error) {
    console.error("Eşleşmeler listelenemedi:", error);
    throw error;
  }
};
