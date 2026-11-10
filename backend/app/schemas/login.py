# for table_login_category

class LoginCategoryCreate(BaseModel):
    login_category: str = Field(min_length=1)

class LoginCategoryUpdate(BaseModel):
    login_category: str | None = Field(default=None, min_length=1)

class LoginCategoryRead(LoginCategoryCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)


# for table_login

class LoginCreate(BaseModel):
    username: str = Field(min_length=3, max_length=30)
    password: str = Field(min_length=8, max_length=20)
    type_login_id: int

class LoginUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=3, max_length=30)
    password: str | None = Field(default=None, min_length=8, max_length=20)
    type_login_id: int | None = None

class LoginRead(BaseModel):
    id: int
    username: str
    type_login_id: int
    login_category_relationship : LoginCategoryRead
    model_config = ConfigDict(from_attributes=True)
