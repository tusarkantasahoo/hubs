AFRAME.registerComponent("three-sixty-image-switch", {
    init() {
      this.updateVisibility = this.updateVisibility.bind(this);
      this.onClick = () => {
        if (this.targetEl) {
          this.targetEl.components["media-loader"].data.mediaOptions = {
            projection: "360-equirectangular",
            alphaMode: "opaque"
          };
          this.targetEl.components["media-loader"].refresh();
        }
      };
      NAF.utils.getNetworkedEntity(this.el).then(networkedEl => {
        this.targetEl = networkedEl;
        window.APP.hubChannel.addEventListener("permissions_updated", this.updateVisibility);
        if (this.targetEl) {
          this.targetEl.addEventListener("pinned", this.updateVisibility);
          this.targetEl.addEventListener("unpinned", this.updateVisibility);
        }
        this.updateVisibility();
      });
    },
    updateVisibility() {
      if (!this.targetEl) return;
      const isPinned = this.targetEl.components.pinnable && this.targetEl.components.pinnable.data.pinned;
      this.el.object3D.visible =
        (!isPinned && window.APP.hubChannel.can("spawn_and_move_media")) || window.APP.hubChannel.can("pin_objects");
    },
    play() {
      this.el.object3D.addEventListener("interact", this.onClick);
    },
    pause() {
      this.el.object3D.removeEventListener("interact", this.onClick);
    },
    remove() {
      window.APP.hubChannel.removeEventListener("permissions_updated", this.updateVisibility);
      if (this.targetEl) {
        this.targetEl.removeEventListener("pinned", this.updateVisibility);
        this.targetEl.removeEventListener("unpinned", this.updateVisibility);
      }
    }
  });