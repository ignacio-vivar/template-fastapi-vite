export interface LoginCategory {
  id: number;
  login_category: string;
}

export interface LoginCategoryCreate {
  login_category: string;
}

export interface LoginCategoryUpdate {
  login_category?: string;
}

export interface Login {
  id: number;
  username: string;
  type_login_id: number;
  login_category_relationship: LoginCategory;
}

export interface LoginCreate {
  username: string;
  password: string;
  type_login_id: number;
}

export interface LoginUpdate {
  username?: string;
  password?: string;
  type_login_id?: number;
}
