<template>
	<div class="content users">
        <div id="message">
            <span></span>
            <i class="fa-solid"></i>
        </div>
		<div>
            <h1>Citations</h1>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nom</th>
                        <th>Citation</th>
                        <th>Utilisateur</th>
                        <th>Date création</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pin in pins" :key="pin.id" :data-id="pin.id">
                        <td>{{ pin.id }}</td>
                        <td><input disabled type="text" name="name" :value="pin.name"></td>
                        <td><input disabled type="text" name="citation" :value="pin.citation"></td>
                        <td>
                            <select disabled name="userId" :value="pin.userId">
                                <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
                            </select>
                        </td>
                        <td v-if="pin.createdAt == ''">Maintenant</td>
                        <td v-else>Il y a {{ pin.createdAt }}</td>
                        <td @click="editPins(pin.id)"><i class="fa-solid fa-pen-to-square"></i></td>
                        <td @click="removePins(pin.id)"><i class="fa-solid fa-trash"></i></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="sidebar">
            <div class="sidebar-item">
                <div class="sidebar-item-header">
                    <h2>Ajouter une citation</h2>
                </div>
                <div class="form">
                    <div>
                        <label for="name">Nom</label>
                        <input v-model="pinsName" type="text" name="name" id="name">
                    </div>
                    <div>
                        <label for="citation">Citation</label>
                        <input v-model="pinsCitation" type="text" name="citation" id="citation">
                    </div>
                    <div>
                        <label for="user">Utilisateur</label>
                        <select v-model="pinsUserId" name="user" id="user">
                            <option value="0">Sélectionner un utilisateur</option>
                            <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
                        </select>
                    </div>
                    <div>
                        <button @click="addPins()">Ajouter</button>
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
            pins: [],
            pinsName: '',
            pinsCitation: '',
            pinsUserId: 0,
            messageActive: false
        }
    },
    async mounted() {
        const responseUsers = await this.$axios.get('/user/getAllUsers.php');
        this.users = responseUsers.data.users;
        const responsePins = await this.$axios.get('/pins/getAllPins.php');
        this.pins = responsePins.data.pins;
        for (const pin of this.pins) {
            pin.edit = false;
        }
    },
    methods: {
        async addPins() {
            const response = await this.$axios.post('/pins/addPins.php', {
                pinsName: this.pinsName,
                pinsCitation: this.pinsCitation,
                pinsUserId: this.pinsUserId
            });
            if (response.data.success) {
                this.pins.push(response.data.pins);
                this.pinsName = '';
                this.pinsCitation = '';
                this.pinsUserId = 0;
            }
        },
        async removePins(pinsId) {
            const response = await this.$axios.post('/pins/removePins.php', {
                pinsId: pinsId
            });
            if (response.data.success) {
                this.addMessage('success', response.data.message);
                this.pins = this.pins.filter(pins => pins.id !== pinsId);
            } else {
                this.addMessage('error', response.data.message);
            }
        },
        async editPins(pinsId) {
            let edit = !this.pins.find(pins => pins.id === pinsId).edit;
            if (!edit) {
                const response = await this.$axios.post('/pins/updatePins.php', {
                    pinsId: pinsId,
                    pinsName: document.querySelector(`tr[data-id="${pinsId}"] input[name="name"]`).value,
                    pinsCitation: document.querySelector(`tr[data-id="${pinsId}"] input[name="citation"]`).value,
                    pinsUserId: document.querySelector(`tr[data-id="${pinsId}"] select`).value
                });
                if (response.data.success) {
                    this.pins.find(pins => pins.id === pinsId).name = response.data.pins.pinsName;
                    this.pins.find(pins => pins.id === pinsId).citation = response.data.pins.pinsCitation;
                    this.pins.find(pins => pins.id === pinsId).userId = response.data.pins.pinsUserId;
                    this.addMessage('success', response.data.message);
                } else {
                    this.addMessage('error', response.data.message);
                    edit = true;
                    return;
                }
            }
            this.pins.find(pins => pins.id === pinsId).edit = edit;
            for (const item of document.querySelectorAll(`tr[data-id="${pinsId}"]`)) {
                for (const input of item.querySelectorAll('input, select')) {
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