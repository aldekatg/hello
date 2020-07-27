<template>
    <v-app>
        <v-main>
            <ListPost/>
        </v-main>
    </v-app>
</template>

<script>
    import ListPost from './components/ListPost';

    export default {
        name: 'App',
        components: {
            ListPost,
        },

        data: () => ({
            //
        }),
    };
</script>
