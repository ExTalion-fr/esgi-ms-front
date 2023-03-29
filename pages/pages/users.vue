<template>
	<div class="content users">
        <div id="message">
            <span>Utilisateur ajouté avec succès</span>
            <i class="fa-solid"></i>
        </div>
		<div>
            <h1>Utilisateurs</h1>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id" :data-id="user.id">
                        <td>{{ user.id }}</td>
                        <td><input disabled type="text" name="name" :value="user.name"></td>
                        <td><input disabled type="text" name="email" :value="user.email"></td>
                        <td @click="editUser(user.id)"><i class="fa-solid fa-pen-to-square"></i></td>
                        <td @click="removeUser(user.id)"><i class="fa-solid fa-trash"></i></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="sidebar">
            <div class="sidebar-item">
                <div class="sidebar-item-header">
                    <h2>Ajouter un utilisateur</h2>
                </div>
                <div class="form">
                    <div>
                        <label for="name">Nom</label>
                        <input v-model="userName" type="text" name="name" id="name">
                    </div>
                    <div>
                        <label for="email">Email</label>
                        <input v-model="userEmail" type="email" name="email" id="email">
                    </div>
                    <div>
                        <button @click="addUser()">Ajouter</button>
                    </div>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
export default {
    data() {
        return {
            users: [],
            userName: '',
            userEmail: '',
            messageActive: false
        }
    },
    async mounted() {
        const response = await this.$axios.get('/user/getAllUsers.php');
        this.users = response.data.users;
        for (const user of this.users) {
            user.edit = false;
        }
    },
    methods: {
        async addUser() {
            const response = await this.$axios.post('/user/addUser.php', {
                userName: this.userName,
                userEmail: this.userEmail
            });
            if (response.data.success) {
                this.users.push(response.data.user);
                this.userName = '';
                this.userEmail = '';
            }
        },
        async removeUser(userId) {
            const response = await this.$axios.post('/user/removeUser.php', {
                userId: userId
            });
            if (response.data.success) {
                this.users = this.users.filter(user => user.id !== userId);
            }
        },
        async editUser(userId) {
            let edit = !this.users.find(user => user.id === userId).edit;
            if (!edit) {
                const response = await this.$axios.post('/user/updateUser.php', {
                    userId: userId,
                    userName: document.querySelector(`tr[data-id="${userId}"] input[name="name"]`).value,
                    userEmail: document.querySelector(`tr[data-id="${userId}"] input[name="email"]`).value
                });
                if (response.data.success) {
                    this.users.find(user => user.id === userId).name = response.data.user.userName;
                    this.users.find(user => user.id === userId).email = response.data.user.userEmail;
                    this.addMessage('success', response.data.message);
                } else {
                    this.addMessage('error', response.data.message);
                    edit = true;
                    return;
                }
            }
            this.users.find(user => user.id === userId).edit = edit;
            for (const item of document.querySelectorAll(`tr[data-id="${userId}"]`)) {
                for (const input of item.querySelectorAll('input')) {
                    input.disabled = !edit;
                    input.classList.toggle('active');
                }
                item.querySelector('i').classList.toggle('fa-circle-check');
                item.querySelector('i').classList.toggle('fa-pen-to-square');
            }
        },
        addMessage(type, message) {
            if (this.messageActive) return;
            this.messageActive = true;
            document.querySelector('#message').classList.add('active');
            document.querySelector('#message').classList.add(type);
            document.querySelector('#message span').innerHTML = message;
            if (type === 'success') {
                document.querySelector('#message i').classList.add('fa-solid', 'fa-circle-check', 'fa-beat-fade');
            } else if (type === 'error') {
                document.querySelector('#message i').classList.add('fa-solid', 'fa-circle-exclamation', 'fa-beat-fade');
            }
            setTimeout(() => {
                document.querySelector('#message').classList.remove('active');
                setTimeout(() => {
                    document.querySelector('#message').classList.remove(type);
                    document.querySelector('#message span').innerHTML = '';
                    document.querySelector('#message i').classList = '';
                    this.messageActive = false;
                }, 500);
            }, 3000);
        }
    },
}
</script>