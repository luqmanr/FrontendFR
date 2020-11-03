<template>
  <div
    class="uploader"
    v-on:dragenter="onDragEnter"
    v-on:dragleave="onDragLeave"
    v-on:dragover.prevent
    v-on:drop="onDrop"
    v-bind:class="{ dragging: isDragging }"
  >
    <div v-show="images.length" class="upload-control">
      <label for="file">Select a file</label>
      <button v-on:click="upload">Upload</button>
    </div>

    <div v-show="!images.length">
      <img src="../assets/avatar_default.png" class="icon" />
      <p>Drag your images here</p>
      <div>OR</div>
      <div class="file-input">
        <label for="file">Select a file</label>
        <input type="file" v-on:change="onInputChange" multiple id="file" />
      </div>
    </div>

    <div class="row">
      <div class="col-md-5">
        <img
          v-show="image_index != null"
          v-bind:src="images[image_index]"
          class="img-wrapper"
        />
      </div>

      <div class="col-md-5">
        <img
          v-show="image_index != null"
          v-bind:src="images[image_index]"
          class="img-wrapper"
        />
        {{ image_index }}
      </div>
    </div>

    <div class="images-preview" v-show="images.length">
      <div
        class="img-wrapper"
        v-for="(image, index) in images"
        v-bind:key="index"
      >
        <img v-bind:src="image" v-on:click="getImgIndex(index)" />

        <div class="details">
          <!-- <span class="name" v-text="files[index].name"></span> -->
          <span>
            <!-- <span class="size" v-text="(files[index].size / 1000)"></span> -->
          </span>
        </div>
      </div>
    </div>

    <!-- {{images}} -->
  </div>
</template>

<script>
import { bus } from "../main";

export default {
  data() {
    return {
      isDragging: false,
      dragCount: 0,
      files: [],
      images: [],
      image_index: null,
    };
  },
  methods: {
    onDragEnter(e) {
      e.preventDefault();
      this.dragCount++;
      this.isDragging = true;
    },
    onDragLeave(e) {
      e.preventDefault();
      this.dragCount--;

      if (this.dragCount <= 0) this.isDragging = false;
    },
    onInputChange(e) {
      const files = e.target.files;
      Array.from(files).forEach((file) => this.addImage(file));
    },
    onDrop(e) {
      e.preventDefault();
      e.stopPropagation();

      this.isDragging = false;

      const files = e.dataTransfer.files;
      Array.from(files).forEach((file) => this.addImage(file));
    },
    addImage(file) {
      if (!file.type.match("image.*")) {
        alert("Please insert an image file");
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        if (this.isReplicate(e.target.result)) {
          alert("You've already added that image!");
        } else {
          this.images.push(e.target.result);
          this.files.push(file);
          this.image_index = this.images.length - 1;
          console.log(this.files);
        }
      };

      reader.readAsDataURL(file);
    },
    upload() {
      const formData = new FormData();

      this.files.forEach((file) => {
        formData.append("images[]", file.file.name);
      });

      axios.post("/images-upload", formData).then((response) => {
        alert("Images have been uploaded successfully");
        this.images = [];
        this.files = [];
      });
    },
    getImgIndex(index) {
      this.image_index = index;
      console.log(this.image_index);
    },
    isReplicate(image) {
      return this.images.includes(image);
    },
  },
};
</script>

<style scoped>
.uploader {
  width: 100%;
  background-color: indianred;
  color: white;
  padding: 40px 15px;
  text-align: center;
  border-radius: 10px;
  /* border: 3px dashed white; */
  font-size: 20px;
  position: relative;
}

.dragging {
  background: white;
  color: indianred;
  border: 3px dashed indianred;
}
.uploader .dragging .file-input label {
  background: white;
  color: indianred;
}
.file-uploader {
  height: 68px;
  width: 200px;
  margin: auto;
  position: relative;
}
.icon {
  max-width: 200px;
  height: auto;
}

.images-preview {
  display: flex;
  flex-wrap: wrap;
  margin-top: 30px;
  justify-content: center;
}

.img-wrapper {
  width: 150px;
  display: flex;
  flex-direction: column;
  height: 150px;
  justify-content: space-between;
  background: white;
  box-shadow: 5px 5px 20px black;
  margin: 5px 5px 5px 5px;
}

.img-wrapper img {
  max-height: 105px;
}

.details {
  color: black;
  justify-content: left;
  font-size: 12px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: self-start;
  padding: 3px 6px;
}

.details .name,
.details .size {
  overflow: hidden;
  height: 20px;
}

label,
input {
  border-radius: 4px;
  background: white;
  color: indianred;
  width: 15vh;
  position: relative;
  align-items: center;
  left: 8vh;
  top: 0px;
  padding: 10px;
  margin-top: 7px;
  cursor: pointer;
  justify-content: center;
  align-content: center;
}
input {
  opacity: 0;
  z-index: -2;
}

.upload-control {
  border-radius: 4px;
  color: indianred;
  left: 0px;
  position: relative;
  top: 0px;
  padding: 10px;
  margin-top: 7px;
  cursor: pointer;
}

.upload-control label {
  left: 0px;
}

.upload-control button {
  border-radius: 4px;
  background: white;
  color: indianred;
  width: 15vh;
  position: relative;
  align-items: center;
  left: 2vh;
  top: 0px;
  padding: 10px;
  margin-top: 7px;
  cursor: pointer;
  justify-content: center;
  align-content: center;
  border-width: 0px;
}
</style>
