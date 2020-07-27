<template>
    <div>
        <v-card>
            <v-container
                    fluid
                    grid-list-md>
                <v-layout column wrap>
                    <v-flex
                            v-for="card in dataS" v-bind:key="card.textAlign">
                        <v-card max-width="344"
                                class="mx-auto">
                            <v-list-item>
                                <v-avatar style="margin-left: -5px; margin-right: 5px"
                                          color="grey">
                                    <img :src="card['ava']">
                                </v-avatar>
                                <v-list-item-content>
                                    <v-list-item-title class="headline">{{card.creator.nickName}}</v-list-item-title>
                                    <v-list-item-subtitle>{{card.creator.city.title}}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <main v-show="!card['files'][0]['typeBool']"> <!--поменять логику карусели с видео-->
                                <agile>
                                    <div v-for="img in card['files']">
                                        <v-img :src="img">
                                            <v-container
                                                    fill-height
                                                    fluid
                                                    pa-2>
                                                <v-layout fill-height>
                                                    <v-flex xs12 align-end flexbox>
                                                        <span class="headline white--text"></span>
                                                    </v-flex>
                                                </v-layout>
                                            </v-container>
                                        </v-img>
                                    </div>
                                </agile>
                            </main>

                            <v-pip class="video" :autoplay="true" v-show="card['files'][0]['typeBool']"
                                   :video-options="card['files'][0]"/>


                            <v-card-title>
                                Новость дня
                            </v-card-title>
                            <v-card-subtitle>
                                {{card.creator.link}}
                            </v-card-subtitle>
                            <v-card-actions>
                                <v-btn icon v-on:click="card['canLike'] ? likePost(card) : unLikePost(card)">
                                    <v-icon v-bind:color="card['canLike'] ? 'grey' : 'pink'">mdi-heart</v-icon>
                                </v-btn>
                                <span class="subheading mr-2">{{card.like_count}}</span>
                                <v-btn icon>
                                    <v-icon>mdi-share-variant</v-icon>
                                </v-btn>
                                <span class="subheading mr-2">{{card.share_count}}</span>
                                <v-btn icon v-on:click="commentPost(card)">
                                    <v-icon>mdi-comment</v-icon>
                                </v-btn>
                                <span class="subheading mr-2">{{card.comment_count}}</span>
                                <v-spacer></v-spacer>

                                <v-btn icon
                                       @click="card.show = !card.show">
                                    <v-icon>{{ card.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                                </v-btn>
                            </v-card-actions>
                            <v-card-text>
                                <v-divider class="mx-2"></v-divider>
                            </v-card-text>
                            <v-expand-transition>
                                <div v-show="card.show">
                                    <v-divider></v-divider>
                                    <v-card-text>
                                        <comments
                                                :comments_wrapper_classes="['custom-scrollbar', 'comments-wrapper']"
                                                :comments="comments"
                                                :current_user="current_user"
                                                @submit-comment="submitComment"
                                        ></comments>
                                    </v-card-text>
                                </div>
                            </v-expand-transition>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
            <scroll-loader :loader-method="updateList" :loader-enable="loadMore">
            </scroll-loader>
        </v-card>
    </div>

</template>
<script>
    import VPip from 'v-pip';
    import Comments from './Comments.vue'

    export default {
        components: {
            VPip,
            Comments
        },
        name: 'HelloWorld',
        props: {
        },
        data() {
            return {
                dataS: [],
                page: 1,
                totalPage: Number,
                loadMore: true,
                pageSize: Number,
                post_code: String,
                likes: 15,
                current_user: {
                    avatar: 'http://via.placeholder.com/100x100/a74848',
                    user: 'Вы'
                },
                comments: []
            }
        },
        methods: {
            updateList() {
                let paramsData = {
                    command: 'sn_get_my_feed_posts',
                    params: {
                        page: this.page++
                    }
                };
                const formData = new FormData();
                formData.append('data', JSON.stringify(paramsData));
                formData.append('token', 'b15b956c-36d5-4100-a873-3250d100c351')
                fetch('https://api.autovse.kz/app/rest', {
                    method: "POST",
                    body: formData
                })
                    .then(res => res.json())
                    .then((json) => {
                        this.dataS = this.dataS.concat(this.srcRender(json))
                        this.dataS.length < this.pageSize && (this.loadMore = false)
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            },
            srcRender(json) {
                for (var i = 0; i < json.list.length; i++) {
                    json.list[i]['show'] = false;
                    if (json.list[i]['creator']['avatar'] !== undefined) {
                        json.list[i]['ava'] = json.list[i]['creator']['avatar']['small'];
                    } else {
                        json.list[i]['ava'] = false;
                    }

                    for (let z = 0; z < json.list[i]['files'].length; z++) {
                        if (json.list[i]['files'][z]['type'] !== 'VIDEO') {
                            json.list[i]['files'][z]['src'] = json.list[i]['files'][z]['file']['big'];
                            json.list[i]['files'][z]['typeBool'] = false;
                        } else {
                            json.list[i]['files'][z]['typeBool'] = true;
                            json.list[i]['files'][z]['width'] = '100%';
                            json.list[i]['files'][z]['height'] = '100%';
                            json.list[i]['files'][z]['src'] = json.list[i]['files'][z]['file']['small'];
                            json.list[i]['files'][z]['poster'] = json.list[i]['files'][z]['file']['thumbnail'];
                        }
                    }
                }
                return json.list;
            },
            likePost(event) {
                console.log(event)
                let paramsData = {
                    command: 'sn_like_feed_post',
                    params: {
                        post_code: event.code
                    }
                };
                if (event.canLike) {
                    event.like_count++
                    event.canLike = false
                    const formData = new FormData();
                    formData.append('data', JSON.stringify(paramsData));
                    formData.append('token', 'b15b956c-36d5-4100-a873-3250d100c351')
                    fetch('https://api.autovse.kz/app/rest', {
                        method: "POST",
                        body: formData
                    })
                        .then(res => res.json())
                        .then((json) => {
                            console.log(json)
                            if (json.status !== 200) {
                                event.canLike = true
                                event.like_count--;
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                } else {
                    console.log('asas')
                }
            },
            unLikePost(event) {
                console.log(event)
                let paramsData = {
                    command: 'sn_unlike_feed_post',
                    params: {
                        post_code: event.code
                    }
                };
                if (!event.canLike) {
                    event.like_count--
                    event.canLike = true
                    const formData = new FormData();
                    formData.append('data', JSON.stringify(paramsData));
                    formData.append('token', 'b15b956c-36d5-4100-a873-3250d100c351')
                    fetch('https://api.autovse.kz/app/rest', {
                        method: "POST",
                        body: formData
                    })
                        .then(res => res.json())
                        .then((json) => {
                            console.log(json)
                            if (json.status !== 200) {
                                event.canLike = false
                                event.like_count++;
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                } else {
                    console.log('asas')
                }
            },
            commentPost(event) {
                let paramsData = {
                    command: 'sn_get_feed_post_comments',
                    params: {
                        post_code: event.code
                    }
                };
                const formData = new FormData();
                formData.append('data', JSON.stringify(paramsData));
                formData.append('token', 'b15b956c-36d5-4100-a873-3250d100c351')
                fetch('https://api.autovse.kz/app/rest', {
                    method: "POST",
                    body: formData
                })
                    .then(res => res.json())
                    .then((json) => {
                        console.log(json);
                        let data = json.list;
                        for (let i = 0; i < data.length; i++) {
                            this.comments.push({
                                id: data[i]['id'],
                                user: data[i]['profile']['nickName'],
                                avatar: data[i]['profile']['avatar']['small'],
                                text: data[i]['message']
                            })
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            },
            submitComment: function (reply) {
                this.comments.push({
                    id: this.comments.length + 1,
                    user: this.current_user.user,
                    avatar: this.current_user.avatar,
                    text: reply
                });
            }
        },

    }
</script>
<style lang="css">
    .agile__nav-button {
        background: transparent;
        border: none;
        color: #fff;
        cursor: pointer;
        font-size: 24px;
        height: 100%;
        position: absolute;
        top: 0;
        -webkit-transition-duration: 0.3s;
        transition-duration: 0.3s;
        width: 80px;
    }

    .agile__nav-button:hover {
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 1;
    }

    .agile__nav-button--prev {
        left: 0;
    }

    .agile__nav-button--next {
        right: 0;
    }

    .agile__dots {
        bottom: 10px;
        left: 50%;
        position: absolute;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
    }

    .agile__dot {
        margin: 0 10px;
    }

    .agile__dot button {
        background-color: transparent;
        border: 1px solid #fff;
        border-radius: 50%;
        cursor: pointer;
        display: block;
        height: 10px;
        font-size: 0;
        line-height: 0;
        margin: 0;
        padding: 0;
        -webkit-transition-duration: 0.3s;
        transition-duration: 0.3s;
        width: 10px;
    }

    .agile__dot--current button, .agile__dot:hover button {
        background-color: #fff;
    }

    .slide {
        display: block;
        height: 500px;
        -o-object-fit: cover;
        object-fit: cover;
        width: 100%;
    }

    .comments-outside {
        box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
        margin: 0 auto;
        max-width: 600px;
    }

    .comments-header {
        background-color: #C8C8C8;
        padding: 10px;
        align-items: center;
        display: flex;
        justify-content: space-between;
        color: #333;
        min-height: 80px;
        font-size: 20px;
    }

    .comments-header .comments-stats span {
        margin-left: 10px;
    }

    .post-owner {
        display: flex;
        align-items: center;
    }

    .post-owner .avatar > img {
        width: 30px;
        height: 30px;
        border-radius: 100%;
    }

    .post-owner .username {
        margin-left: 5px;
    }

    .post-owner .username > a {
        color: #333;
    }

</style>