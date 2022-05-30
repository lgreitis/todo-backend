export interface NBAMatch {
  id: number;
  date: string;
  home_team_score: number;
  visitor_team_score: number;
  season: number;
  // 0 if not started, 1,2,3,4
  period: number;
  status: string;
  // if "" then not started or ended
  time: string;
  postseason: boolean;
  home_team: {
    id: number;
    name: string;
  };
  visitor_team: {
    id: number;
    name: string;
  };
}
