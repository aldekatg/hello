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
                            <v-img v-show="!card['files'][0]['typeBool']" :src="card.files[0].file.big">
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
                            <v-pip class="video" v-show="card['files'][0]['typeBool']" :video-options="card.files[0]"/>
                            <v-card-title>
                                Новость дня
                            </v-card-title>
                            <v-card-subtitle>
                                {{card.creator.link}}
                            </v-card-subtitle>
                            <v-card-actions>
                                <v-btn icon>
                                    <v-icon>mdi-heart</v-icon>
                                </v-btn>
                                <span class="subheading mr-2">{{card.like_count}}</span>
                                <v-btn icon>
                                    <v-icon>mdi-share-variant</v-icon>
                                </v-btn>
                                <span class="subheading mr-2">{{card.share_count}}</span>
                                <v-btn icon>
                                    <v-icon>mdi-comment</v-icon>
                                </v-btn>
                                <span class="subheading mr-2">{{card.comment_count}}</span>
                                <v-spacer></v-spacer>

                                <v-btn icon
                                       @click="card.show = !card.show">
                                    <v-icon>{{ card.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                                </v-btn>
                            </v-card-actions>
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
                    if (json.list[i]['files'].length >= 1) {
                        if (json.list[i]['files'][0]['type'] !== 'VIDEO') {
                            json.list[i]['files'][0]['typeBool'] = false;
                        } else {
                            json.list[i]['files'][0]['typeBool'] = true;
                            json.list[i]['files'][0]['width'] = '100%';
                            json.list[i]['files'][0]['src'] = json.list[i]['files'][0]['file']['small'];
                            json.list[i]['files'][0]['poster'] = json.list[i]['files'][0]['file']['thumbnail'];
                        }
                    } else {
                        console.log('kek')
                    }
                }
                return json.list;
            }
        },

    }
</script>
<style lang="css">
    .pagination {
    }

    .page-item {
    }
</style>