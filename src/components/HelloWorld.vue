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

                            <main v-show="!card['files'][0]['typeBool']">
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
<!--                                <div class="comments-outside">-->
<!--                                    <div class="comments-header">-->
<!--                                        <div class="comments-stats">-->
<!--                                            <span><i class="fa fa-thumbs-up"></i> sada</span>-->
<!--                                            <span><i class="fa fa-comment"></i> [[ comments.length ]]</span>-->
<!--                                        </div>-->
<!--                                        <div class="project-owner">-->
<!--                                            <div class="avatar">-->
<!--                                                <img :src="card['ava']" alt="">-->
<!--                                            </div>-->
<!--                                            <div class="username">-->
<!--                                                <a href="#">@[[ creator.user ]]</a>-->
<!--                                            </div>-->
<!--                                        </div>-->
<!--                                    </div>-->
<!--                                    <comments-->
<!--                                            :comments_wrapper_classes="['custom-scrollbar', 'comments-wrapper']"-->
<!--                                            :comments="comments"-->
<!--                                            :current_user="current_user"-->
<!--                                            @submit-comment="submitComment"-->
<!--                                    ></comments>-->
<!--                                </div>-->
                            </v-card-text>
                            <v-expand-transition>
                                <div v-show="card.show">
                                    <v-divider></v-divider>

                                    <v-card-text>
                                        {{card.text}}
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

    export default {
        components: {
            VPip
        },
        name: 'HelloWorld',
        data() {
            return {
                dataS: [],
                page: 1,
                totalPage: Number,
                loadMore: true,
                pageSize: Number,
                post_code: String
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
                        console.log(json)
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            },
        },

    }
</script>
<style lang="sass">
    // VueAgile styles
    .agile
        &__nav-button
            background: transparent
            border: none
            color: #fff
            cursor: pointer
            font-size: 24px
            height: 100%
            position: absolute
            top: 0
            transition-duration: .3s
            width: 80px

            &:hover
                background-color: rgba(#000, .5)
                opacity: 1

            &--prev
                left: 0

            &--next
                right: 0

        &__dots
            bottom: 10px
            left: 50%
            position: absolute
            transform: translateX(-50%)

        &__dot
            margin: 0 10px

            button
                background-color: transparent
                border: 1px solid #fff
                border-radius: 50%
                cursor: pointer
                display: block
                height: 10px
                font-size: 0
                line-height: 0
                margin: 0
                padding: 0
                transition-duration: .3s
                width: 10px

            &--current,
            &:hover
                button
                    background-color: #fff

        // Slides styles
        .slide
            display: block
            height: 500px
            object-fit: cover
            width: 100%
</style>