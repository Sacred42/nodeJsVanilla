class Chat {
    constructor(data) {
        this.sortedMessagesByDate(data);
        return this.createChats(data);
    }

    sortedMessagesByDate(messages) {
        messages.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
    }

    createChats(data) {
        const messages = data.map((item) => {
            return {
                text: item.text,
                created: item.created,
                updated: item.updated,
                user_id: item.user_id,
                user_name: item.name,
                readstatus: item.readstatus,
                id: item.id
            }
        })

        return [{
            chat_id: data[0].chat_id,
            messages: messages,
            active: true,
        }]
    }
}

module.exports = Chat;