export interface Comment {
  id: number;
  mid: string;
  text: string;
  text_raw: string;
  source: string;
  user: {
    id: number;
    screen_name: string;
  };
}
