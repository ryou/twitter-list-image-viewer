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
            <span class="Status_name">{{ tweet.user.name }}</span>
            <span class="Status_screenName">@{{ tweet.user.screen_name }}</span>
            <span class="Status_created">{{ tweetDate }}</span>
          </div>
          <div class="Status_body">
            {{ tweet.text }}
          </div>
          <div class="Status_actions">
            <div class="Status_action">
              <q-btn
                v-if="status.favorited"
                round
                icon="favorite"
                text-color="red"
                @click="unfavorite"
              />
              <q-btn
                v-else
                round
                icon="favorite"
                @click="favorite"
              />
            </div>
            <div class="Status_action">
              <q-btn
                v-if="status.retweeted"
                round
                icon="repeat"
                text-color="green"
                @click="unretweet"
              />
              <q-btn
                v-else
                round
                icon="repeat"
                @click="retweet"
              />
            </div>
            <div class="Status_action">
              <q-btn
                round
                icon="more_horiz"
                @click="showActionSheet = true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <TweetActionSheet
      :active="showActionSheet"
      :status="tweet"
      @hide="showActionSheet = false"
    />
  </div>
</template>

<script>
import TweetActionSheet from '@/components/TweetActionSheet'

export default {
  name: 'Status',
  components: {
    TweetActionSheet,
  },
  props: {
    status: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      isConnecting: {
        favorite: false,
        retweet: false,
      },
      showActionSheet: false,
    }
  },
  computed: {
    tweet () {
      if (this.status.retweeted_status !== undefined) {
        return this.status.retweeted_status
      }

      return this.status
    },
    tweetDate () {
      const date = new Date(this.tweet.created_at)

      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    },
  },
  methods: {
    favorite () {
      if (this.isConnecting.favorite) {
        return
      }
      this.isConnecting.favorite = true
      this.$store.dispatch('favorite', this.status.id_str)
        .then(() => {
          this.isConnecting.favorite = false
        })
    },
    unfavorite () {
      if (this.isConnecting.favorite) {
        return
      }
      this.isConnecting.favorite = true
      this.$store.dispatch('unfavorite', this.status.id_str)
        .then(() => {
          this.isConnecting.favorite = false
        })
    },
    retweet () {
      if (this.isConnecting.retweet) {
        return
      }
      this.isConnecting.retweet = true
      this.$store.dispatch('retweet', this.status.id_str)
        .then(() => {
          this.isConnecting.retweet = false
        })
    },
    unretweet () {
      if (this.isConnecting.retweet) {
        return
      }
      this.isConnecting.retweet = true
      this.$store.dispatch('unretweet', this.status.id_str)
        .then(() => {
          this.isConnecting.retweet = false
        })
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
  font-size: 12px;
  line-height: 1.3;

  border-bottom: 1px solid rgba(#fff, .75);
  padding-bottom: 10px;
}
.Status_actions {
  display: flex;
  justify-content: flex-start;
}
.Status_action {
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 80px;
}
</style>
