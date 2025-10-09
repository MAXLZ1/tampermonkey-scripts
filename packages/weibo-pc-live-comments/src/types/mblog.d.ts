export interface MBlog {
  visible: {
    type: number;
    list_id: number;
  };
  created_at: string;
  id: number;
  idstr: string;
  mid: string;
  mblogid: string;
  user: {
    id: number;
    idstr: string;
    pc_new: number;
    screen_name: string;
    profile_image_url: string;
    profile_url: string;
    verified: boolean;
    verified_type: number;
    domain: string;
    weihao: string;
    status_total_counter: {
      total_cnt_format: string;
      comment_cnt: string;
      repost_cnt: string;
      like_cnt: string;
      total_cnt: string;
    };
    avatar_large: string;
    avatar_hd: string;
    follow_me: boolean;
    following: boolean;
    mbrank: number;
    mbtype: number;
    v_plus: number;
    user_ability: number;
    planet_video: boolean;
    icon_list: string[];
  };
  can_edit: boolean;
  textLength: number;
  source: string;
  favorited: boolean;
  rid: string;
  pic_ids: string[];
  pic_num: number;
  is_paid: boolean;
  mblog_vip_type: number;
  number_display_strategy: {
    apply_scenario_flag: number;
    display_text_min_number: number;
    display_text: string;
  };
  reposts_count: number;
  comments_count: number;
  attitudes_count: number;
  attitudes_status: number;
  isLongText: boolean;
  mlevel: number;
  content_auth: number;
  is_show_bulletin: number;
  comment_manage_info: {
    comment_permission_type: number;
    approval_comment_type: number;
    comment_sort_type: number;
  };
  share_repost_type: number;
  url_struct: {
    url_title: string;
    url_type_pic: string;
    ori_url: string;
    page_id: string;
    short_url: string;
    long_url: string;
    url_type: number;
    result: boolean;
    actionlog: {
      act_type: number;
      act_code: number;
      lcardid: string;
      fid: string;
      mid: string;
      oid: string;
      uuid: number;
      source: string;
      ext: string;
    };
    storage_type: string;
    hide: number;
    object_type: string;
    hnumber_target_url: string;
    need_save_obj: number;
  }[];
  mblogtype: number;
  showFeedRepost: boolean;
  showFeedComment: boolean;
  pictureViewerSign: boolean;
  showPictureViewer: boolean;
  rcList: string[];
  analysis_extra: string;
  readtimetype: string;
  mixed_count: number;
  is_show_mixed: boolean;
  mblog_feed_back_menus_format: string[];
  isSinglePayAudio: boolean;
  text: string;
  text_raw: string;
  region_name: string;
  page_info?: {
    type: string; // "26"直播间
    page_id: string;
    object_type: string;
    page_desc: string;
    oid: number;
    page_title: string;
    page_pic: string;
    type_icon: string;
    page_url: string;
    object_id: string;
    media_info: {
      stream_url: string;
      open_scheme: string;
      live_start_time: number;
      live_replay_counts: number;
      real_chatroom_users: number;
      prevue_number: number;
      live_id: string;
      live_status: number;
      real_status: number;
      live_ld: string;
      watch_limit: number;
      create_source: number;
      busi_code: string[];
      subscribe: {
        is_subscribe: boolean;
        cover: string;
        base_cover: string;
        base_cover_landscape: string;
        subscribe_id: string;
        cover_pid: string;
        background_id: string;
        background_cover: string;
        background_custom_pid: string;
        is_expired: boolean;
      };
      protocol: string;
      play_preview_info: {
        tips_time: number;
        tips_title_prefix: string;
        tips_title_suffix: string;
        total_preview_time: number;
      };
      is_keep_current_mblog: number;
    };
    author_id: number;
    authorid: number;
    contentnumber: string;
    contentnumber: string;
    pic_info: {
      pic_big: {
        height: string;
        url: string;
        width: string;
      };
      pic_small: {
        height: string;
        url: string;
        width: string;
      };
      pic_middle: {
        width: string;
        url: string;
        height: string;
      };
    };
    status: string;
    live: {
      height: string;
      width: string;
      bitrate: string;
    };
    author: {
      vip: string;
      screen_name: string;
    };
    live_card_version: string;
    actionlog: {
      act_type: number;
      act_code: number;
      lcardid: string;
      fid: string;
      mid: string;
      oid: string;
      uuid: number;
      source: string;
      ext: string;
    };
    sub_status: number;
    watch_limit: number;
  };
}
