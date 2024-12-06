CREATE TABLE acc.users(
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email NVARCHAR(50) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    is_verified BIT DEFAULT 0,
    verification_code INT,
    code_issued_at DATETIME
)

CREATE TABLE acc.roles(
    role_id INT IDENTITY(1,1) PRIMARY KEY,
    description text
)

CREATE TABLE acc.user_roles (
    user_id INT FOREIGN KEY REFERENCES acc.users(user_id) ON DELETE CASCADE NOT NULL,
    role_id INT FOREIGN KEY REFERENCES acc.roles(role_id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (user_id, role_id)
)

CREATE TABLE acc.posts(
    post_id INT IDENTITY(1,1) PRIMARY KEY,
    content text NOT NULL,
    author_id INT FOREIGN KEY REFERENCES acc.users(user_id) ON DELETE CASCADE NOT NULL
)

CREATE TABLE acc.comments(
    comment_id INT IDENTITY(1,1) PRIMARY KEY,
    content text NOT NULL,
    author_id INT FOREIGN KEY REFERENCES acc.users(user_id) ON DELETE CASCADE NOT NULL,
    post_id INT FOREIGN KEY REFERENCES acc.posts(post_id) NOT NULL
)