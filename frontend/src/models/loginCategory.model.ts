export interface LoginCategory {
  id: number;
  login_category: string;
}

export interface LoginCategoryCreate {
  login_category: string;
}

export type LoginCategoryUpdate = Partial<LoginCategoryCreate>;
