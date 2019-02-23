<template>
  <div class="Status">
    <div class="Status_content">
      <div
        v-if="status.retweeted_status !== undefined"
        class="Status_row"
      >
        <div class="Status_leftCol">
          <q-icon
            class="text-positive"
            name="repeat"
          />
        </div>
        <div class="Status_rightCol">
          <div class="Status_retweet q-caption">
            <a
              :href="`https://twitter.com/${status.user.screen_name}`"
              target="_blank"
            >{{ status.user.name }}</a>さんがリツイートしました
          </div>
        </div>
      </div>
      <div class="Status_row">
        <div class="Status_leftCol">
          <div class="Status_profileImage">
            <img :src="tweet.user.profile_image_url_https">
          </div>
        </div>
        <div class="Status_rightCol">
          <div class="Status_info">
            <a
              :href="`https://twitter.com/${tweet.user.screen_name}`"
              target="_blank"
              class="Status_name"
            >{{ tweet.user.name }}</a>
            <a
              :href="`https://twitter.com/${tweet.user.screen_name}`"
              target="_blank"
              class="Status_screenName"
            >@{{ tweet.user.screen_name }}</a>・
            <a
              :href="`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`"
              target="_blank"
              class="Status_created"
            >{{ tweetDate }}</a>
          </div>
          <div class="Status_body">
            {{ tweet.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Status',
  props: {
    status: {
      type: Object,
      required: true,
    },
  },
  computed: {
    tweet () {
      if (this.status.retweeted_status !== undefined) return this.status.retweeted_status

      return this.status
    },
    tweetDate () {
      const date = new Date(this.tweet.created_at)

      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    },
  },
}
</script>

<style lang="scss" scoped>
.Status {
  display: inline-block;
  vertical-align: top;

  text-align: left;
  color: #fff;

  width: 100%;
  max-width: 600px;

  a {
    color: #fff;
    text-decoration: none;
  }
}
.Status_row {
  display: flex;

  &:not(:last-child) {
    margin-bottom: 5px;
  }
}
.Status_leftCol {
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: 35px;

  text-align: right;
}
.Status_rightCol {
  flex-shrink: 1;
  flex-grow: 1;

  padding-left: 10px;
}
.Status_profileImage {
  img {
    vertical-align: top;
    width: 35px; height: 35px;
    object-fit: cover;

    border-radius: 5px;
  }
}
.Status_info {
  line-height: 1.2;

  margin-bottom: 3px;
}
.Status_name {
  font-size: 14px;
  font-weight: bold;
}
.Status_screenName {
  font-size: 12px;
}
.Status_created {
  font-size: 12px;
}
.Status_body {
  font-size: 13px;
}
</style>