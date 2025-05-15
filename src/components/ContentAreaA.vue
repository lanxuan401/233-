<template>
  <div
    class="content-area"
    ref="scrollArea"
    @scroll="handleScroll"
  >
    <div
      class="refresh-tip"
      v-if="refreshing"
    >
      正在刷新...
    </div>
    <div class="waterfall">
      <div
        class="column"
        v-for="(col, idx) in columns"
        :key="idx"
      >
        <div
          v-for="(item, i) in col"
          :key="item.id || 'recommend-' + i"
          class="item"
        >
          <template v-if="item.type === 'recommend'">
            <div class="user-recommend">
              <div class="recommend-title">
                优质用户推荐
                <span class="more">···</span>
              </div>
              <div
                class="recommend-user"
                v-for="user in recommendUsers"
                :key="user.name"
              >
                <div class="recommend-avatar-wrap">
                  <img
                    :src="user.avatar"
                    class="recommend-avatar"
                  />
                  <div class="recommend-follow">
                    <span class="plus">+</span>
                  </div>
                </div>
                <div class="recommend-info">
                  <div class="recommend-name">{{ user.name }}</div>
                  <div class="recommend-desc">{{ user.desc }}</div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div v-if="item.type === 'image'">
              <img
                :src="item.src"
                :alt="item.title"
                class="media"
              />
            </div>
            <div v-else-if="item.type === 'video'">
              <div
                class="media video-cover"
                @click="toggleVideo(item, $event)"
              >
                <template v-if="!item.showVideo">
                  <img
                    :src="item.cover || defaultVideoCover"
                    class="media"
                  />
                  <div class="play-btn">
                    <svg
                      viewBox="0 0 64 64"
                      width="20"
                      height="20"
                    >
                      <circle
                        cx="32"
                        cy="32"
                        r="32"
                        fill="rgba(0,0,0,0.4)"
                      />
                      <polygon
                        points="26,20 26,44 46,32"
                        fill="#fff"
                      />
                    </svg>
                  </div>
                </template>
                <video
                  v-else
                  :ref="'video-' + item.id"
                  :src="item.src"
                  class="media"
                  autoplay
                  muted
                  playsinline
                ></video>
              </div>
            </div>
            <div class="title">{{ item.title }}</div>
            <div class="metaDesc">{{ item.metaDesc }}</div>
            <div class="info-row">
              <div style="display: flex">
                <img
                  :src="item.avatar"
                  class="avatar"
                />
                <span class="author">{{ item.author }}</span>
              </div>
              <div
                class="like"
                style="display: flex"
              >
                <svg
                  class="like-icon"
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                >
                  <path
                    fill="#888"
                    d="M9 21h-6c-1.1 0-2-0.9-2-2v-7c0-1.1 0.9-2 2-2h6v11zm12-9c0-1.1-0.9-2-2-2h-5.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06l-1-1c-.37-.36-.89-.54-1.41-.46-.52.08-.97.44-1.13.95l-3.24 9.65c-.09.28-.14.57-.14.87v5c0 1.1.9 2 2 2h8c.82 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1z"
                  />
                </svg>
                {{ item.like }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div
      class="loading-tip"
      v-if="loading"
    >
      加载中...
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentArea',
  data() {
    return {
      refreshing: false,
      loading: false,
      columns: [[], []],
      allData: [],
      page: 1,
      pageSize: 10,
      defaultVideoCover:
        'https://dummyimage.com/300x140/cccccc/ffffff&text=Video',
      recommendUsers: [
        {
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          name: '阿辞',
          desc: '不接无偿，只画自己喜欢的'
        },
        {
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          name: '青空千绪',
          desc: '关注我，随机抽人送礼！'
        },
        {
          avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
          name: '大橘无情',
          desc: '摆烂选手元老评测，每天就是'
        }
      ]
    }
  },
  mounted() {
    this.loadData(true)
  },
  methods: {
    mockItem(id) {
      const isVideo = Math.random() > 0.7
      const avatars = [
        'https://randomuser.me/api/portraits/men/32.jpg',
        'https://randomuser.me/api/portraits/women/44.jpg',
        'https://randomuser.me/api/portraits/men/65.jpg',
        'https://randomuser.me/api/portraits/women/68.jpg'
      ]
      const authors = ['阿萍', '青空下', '小明', '小红']
      const metaDescs = ['迷你世界', '恐龙岛', '泡芙云', '小鱼晋升']
      return {
        id,
        title: `内容标题 ${id}`,
        desc: '我是你的牵牵。',
        metaDesc: metaDescs[id % metaDescs.length],
        type: isVideo ? 'video' : 'image',
        src: isVideo
          ? 'https://www.w3schools.com/html/mov_bbb.mp4'
          : `https://picsum.photos/seed/${id}/300/2${Math.floor(Math.random() * 10) + 5}`,
        avatar: avatars[id % avatars.length],
        author: authors[id % authors.length],
        like: Math.floor(Math.random() * 1000),
        showVideo: false,
        cover: isVideo
          ? 'https://picsum.photos/seed/cover' + id + '/300/140'
          : ''
      }
    },
    mockData(page) {
      return Array.from({ length: this.pageSize }, (_, i) =>
        this.mockItem((page - 1) * this.pageSize + i + 1)
      )
    },
    splitColumns(data) {
      // 在分列前随机插入推荐块
      const recommend = { type: 'recommend' }
      const insertIdx = Math.floor(Math.random() * data.length)
      const newData = [...data]
      newData.splice(insertIdx, 0, recommend)

      const colHeights = [0, 0]
      const cols = [[], []]
      newData.forEach((item) => {
        // 简单模拟高度
        const h =
          item.type === 'image'
            ? 200 + Math.random() * 100
            : item.type === 'video'
              ? 250
              : 160
        const idx = colHeights[0] <= colHeights[1] ? 0 : 1
        cols[idx].push(item)
        colHeights[idx] += h
      })
      return cols
    },
    loadData(isRefresh = false) {
      if (this.loading) return
      this.loading = true
      setTimeout(() => {
        let newData
        if (isRefresh) {
          this.page = 1
          newData = this.mockData(this.page)
          this.allData = [...newData]
        } else {
          this.page += 1
          newData = this.mockData(this.page)
          this.allData = [...this.allData, ...newData]
        }
        this.columns = this.splitColumns(this.allData)
        this.loading = false
        if (isRefresh) this.refreshing = false
      }, 800)
    },
    handlePullDown() {
      if (this.refreshing) return
      this.refreshing = true
      this.loadData(true)
    },
    handleScroll(e) {
      const el = e.target
      if (el.scrollTop === 0) {
        this.handlePullDown()
      }
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 50) {
        this.loadData()
      }
    },
    toggleVideo(item) {
      if (!item.showVideo) {
        this.$set(item, 'showVideo', true)
        this.$nextTick(() => {
          let video = this.$refs['video-' + item.id]
          if (Array.isArray(video)) video = video[0]
          if (video && video.play) video.play()
        })
      } else {
        let video = this.$refs['video-' + item.id]
        if (Array.isArray(video)) video = video[0]
        if (video) {
          if (video.paused) {
            video.play()
          } else {
            video.pause()
          }
        }
      }
    },
    onVideoPlay() {
      // 可选：播放时做其他处理
    }
  }
}
</script>

<style scoped>
.content-area {
  height: 100vh;
  overflow-y: auto;
  background: #fafbfc;
  padding: 0.5rem;
}
.waterfall {
  display: flex;
  gap: 0.2rem;
}
.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.item {
  background: #fff;
  border-radius: 5px;
  margin-bottom: 0.05rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100px;
  width: 100%;
  transition: box-shadow 0.2s;
}
.user-recommend {
  background: linear-gradient(180deg, #fff7f2 0%, #fff 100%);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(255, 130, 0, 0.08);
  padding: 18px 12px 12px 12px;
}
.recommend-title {
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  letter-spacing: 1px;
}
.recommend-title .more {
  color: #bbb;
  font-size: 1.2rem;
  font-weight: normal;
}
.recommend-user {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  position: relative;
}
.recommend-user:last-child {
  margin-bottom: 0;
}
.recommend-avatar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
}
.recommend-info {
  text-align: left;
  .recommend-name {
    font-weight: 600;
    font-size: 1rem;
  }
  .recommend-desc {
    font-size: 0.55rem;
  }
}
.recommend-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  background: #fff;
}
.recommend-follow {
  margin-top: -8px;
  background: #ff8200;
  color: #fff;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(255, 130, 0, 0.1);
  flex-shrink: 0;
  border: 2px solid #fff;
}
.plus {
  display: inline-block;
  line-height: 1;
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: -2px;
}
.media {
  width: 100%;
  min-height: 70px;
  display: block;
  border-bottom: 1px solid #f0f0f0;
  object-fit: cover;
  background: #f5f5f5;
}
.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  margin-bottom: 0.3rem;
  font-size: 0.95rem;
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 0.5rem;
    object-fit: cover;
    border: 1px solid #eee;
  }
  .author {
    color: #333;
    font-weight: 500;
    font-size: 0.75rem;
    text-align: left;
  }
  .like {
    display: flex;
    align-items: center;
    color: #888;
    font-size: 0.75rem;
    .like-icon {
      margin-right: 0.2rem;
    }
  }
}
.title {
  font-size: 1rem;
  color: #222;
  font-weight: bold;
  margin-top: 0.2rem;
  text-align: center;
  line-height: 1.35;
  word-break: break-all;
  text-align: left;
  padding: 8px;
}
.metaDesc {
  text-align: left;
  padding-left: 8px;
  font-size: 0.75rem;
}
.refresh-tip,
.loading-tip {
  text-align: center;
  color: #888;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}
@media (max-width: 600px) {
  .content-area {
    padding: 0.2rem;
  }
  .title {
    font-size: 0.9rem;
  }
  .info-row {
    font-size: 0.75rem;
    padding: 8px 8px;
    .avatar {
      width: 15px;
      height: 15px;
    }
  }
}
.video-cover {
  position: relative;
  cursor: pointer;
  .media {
    display: block;
  }
  .play-btn {
    position: absolute;
    right: 12px;
    top: 12px;
    transform: none;
    z-index: 2;
    pointer-events: none;
  }
}
</style>
