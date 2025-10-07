export interface Comment {
  id: number;
  idstr: string;
  mid: string;
  text: string;
  text_raw: string;
  source: string;
  user: {
    id: number;
    screen_name: string;
    avatar_hd: string;
    avatar_large: string;
    cover_image_phone: string;
    fansIcon: {
      fans_uid: number;
      val: number;
      member_rank: number;
      svip: number;
      vvip: number;
      lighting: boolean;
      icon_url: string;
      uid: number;
      name: string;
      scheme: string;
    };
  };
}
