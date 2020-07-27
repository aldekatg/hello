<template>

    <div class="comments">
        <div class="first-content">
            <div class="avatar">
                <img :src="comment.avatar" alt="">
            </div>
            <div class="comment">
                <div class="top-content">
                    <div class="user-name">
                        {{ comment.user }}
                    </div>
                    <div class="text">
                        {{ comment.text }}
                    </div>
                </div>
                <div class="bottom-content">
                    <div class="post-like">Нравиться: {{comment.like_count}}</div>
                        <a  class="answer-post">Ответить</a>
                </div>
            </div>
        </div>
        <div class="like">
            <v-btn icon @click="like(comment)">
                <v-icon>mdi-heart</v-icon>
            </v-btn>
        </div>
    </div>


</template>

<script>
    export default {
        name: 'SingleComment',
        props: ['comment'],
        methods: {
            like(comment) {
                this.$emit('like', comment);
                console.log(comment)
            }
        }
    }
</script>

<style scoped>

    .comments {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 5px;
        width: 100%;
        height: 100%;
    }

    .comments .first-content {
        display: flex;
        width: 100%;
        flex-direction: row;
    }

    .comments .avatar > img {
        width: 40px;
        height: 40px;
        border-radius: 100%;
        align-self: start;
    }

    .comment {
        display: flex;
        width: 100%;
        flex-direction: column;
        padding: 0px 5px;
    }

    .top-content {
        display: flex;
        flex-direction: row;
    }

    .comment .user-name {
        color: #111111;
        padding-right: 5px;
        font-weight: bold
    }

    .bottom-content {
        color: #999999;
        display: flex;
        justify-content: space-between;
    }

    .answer-post:hover,
    .answer-post:active {
        text-decoration: underline
    }

</style>