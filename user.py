class User:
    def __init__(self, id, user, name, email, nickname, password, plano, group):
        self.id = id
        self.username = user
        self.name = name
        self.email = email
        self.nickname = nickname
        self.password = password
        self.plano = plano
        self.group = group

    def get_id(self):
        return self.id
    
    def is_active(self):
        return True
    
    def is_anonymous(self):
        return False
    
    def is_authenticated(self):
        return True