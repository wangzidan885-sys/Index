/* ==========================
   Portfolio Website Script
   Wang Xingqi Portfolio
========================== */


const cards = document.querySelectorAll(".card");





/* ==========================
   页面滚动动画
========================== */


const observer =
new IntersectionObserver(
(entries)=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


entry.target.classList.add("show");


}


});


},
{

threshold:0.15

});



cards.forEach(card=>{

observer.observe(card);

});





/* ==========================
   导航栏滚动效果
========================== */


const header =
document.querySelector("header");



window.addEventListener(
"scroll",
()=>{


if(window.scrollY > 50){


header.style.boxShadow =
"0 5px 20px rgba(0,0,0,.3)";


}


else{


header.style.boxShadow =
"none";


}


});





/* ==========================
   图片加载优化
========================== */


const images =
document.querySelectorAll("img");



images.forEach(img=>{


img.loading = "lazy";


});





/* ==========================
   页面加载淡入
========================== */


window.addEventListener(
"load",
()=>{


document.body.style.opacity="1";


});


/* ==========================
   头像编辑器模块
   功能：双击头像打开编辑弹窗，支持图片变换（裁剪、缩放、旋转、翻转）
   数据持久化：使用localStorage保存变换参数，刷新页面后自动恢复
========================== */

// DOM元素获取
const avatarContainer = document.getElementById('avatar-container');
const avatarFrame = document.querySelector('.avatar-frame');
const avatarImage = document.getElementById('avatar-image');
const modal = document.getElementById('avatar-editor-modal');
const modalOverlay = document.getElementById('modal-overlay');
const closeEditor = document.getElementById('close-editor');
const previewImage = document.getElementById('preview-image');
const confirmModal = document.getElementById('confirm-modal');
const confirmOverlay = document.getElementById('confirm-overlay');
const confirmYes = document.getElementById('confirm-yes');
const confirmNo = document.getElementById('confirm-no');

// 控制面板元素
const cropX = document.getElementById('crop-x');
const cropY = document.getElementById('crop-y');
const scaleInput = document.getElementById('scale');
const rotateInput = document.getElementById('rotate');
const flipH = document.getElementById('flip-h');
const flipV = document.getElementById('flip-v');
const resetAvatar = document.getElementById('reset-avatar');
const applyAvatar = document.getElementById('apply-avatar');

// 变换参数状态
let flipHValue = 1;
let flipVValue = 1;

// 默认变换参数
const DEFAULT_SETTINGS = {
    cropX: 50,
    cropY: 15,
    scale: 1,
    rotate: 0,
    flipH: 1,
    flipV: 1
};

// localStorage存储键名
const STORAGE_KEY = 'avatar_transform_settings';

/**
 * 从localStorage加载保存的变换参数
 */
function loadSettings() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error('加载头像设置失败:', e);
    }
    return DEFAULT_SETTINGS;
}

/**
 * 保存变换参数到localStorage
 */
function saveSettings(settings) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
        console.error('保存头像设置失败:', e);
    }
}

/**
 * 计算变换矩阵
 * @param {number} x - 水平位置百分比 (0-100)
 * @param {number} y - 垂直位置百分比 (0-100)
 * @param {number} scale - 缩放比例 (1-3)
 * @param {number} rotate - 旋转角度 (-180-180)
 * @param {number} fh - 水平翻转 (1或-1)
 * @param {number} fv - 垂直翻转 (1或-1)
 * @returns {string} CSS transform字符串
 */
function calculateTransform(x, y, scale, rotate, fh, fv) {
    // 将百分比转换为相对偏移量
    // 当图片放大时，偏移量需要相应调整
    const translateX = ((x - 50) / 50) * (scale - 1) * 50;
    const translateY = ((y - 50) / 50) * (scale - 1) * 50;
    
    // 构建transform字符串：先翻转，再缩放，再平移，最后旋转
    return `scaleX(${fh * scale}) scaleY(${fv * scale}) translateX(${translateX}%) translateY(${translateY}%) rotate(${rotate}deg)`;
}

/**
 * 更新预览图片的变换效果
 */
function updatePreview() {
    // 获取当前控件值
    const x = parseFloat(cropX.value);
    const y = parseFloat(cropY.value);
    const s = parseFloat(scaleInput.value);
    const r = parseFloat(rotateInput.value);
    
    // 应用变换
    previewImage.style.transform = calculateTransform(x, y, s, r, flipHValue, flipVValue);
}

/**
 * 将变换效果应用到实际头像
 */
function applyChanges() {
    // 获取当前控件值
    const x = parseFloat(cropX.value);
    const y = parseFloat(cropY.value);
    const s = parseFloat(scaleInput.value);
    const r = parseFloat(rotateInput.value);
    
    // 保存设置到localStorage
    saveSettings({
        cropX: x,
        cropY: y,
        scale: s,
        rotate: r,
        flipH: flipHValue,
        flipV: flipVValue
    });
    
    // 应用变换到实际头像
    avatarImage.style.transform = calculateTransform(x, y, s, r, flipHValue, flipVValue);
    
    // 关闭编辑弹窗
    closeEditorModal();
}

/**
 * 重置编辑器到默认状态
 */
function resetEditor() {
    // 恢复默认值
    cropX.value = DEFAULT_SETTINGS.cropX;
    cropY.value = DEFAULT_SETTINGS.cropY;
    scaleInput.value = DEFAULT_SETTINGS.scale;
    rotateInput.value = DEFAULT_SETTINGS.rotate;
    flipHValue = DEFAULT_SETTINGS.flipH;
    flipVValue = DEFAULT_SETTINGS.flipV;
    
    // 更新预览
    updatePreview();
}

/**
 * 打开编辑弹窗
 */
function openEditor() {
    // 同步当前头像的变换参数到控件
    const settings = loadSettings();
    cropX.value = settings.cropX;
    cropY.value = settings.cropY;
    scaleInput.value = settings.scale;
    rotateInput.value = settings.rotate;
    flipHValue = settings.flipH;
    flipVValue = settings.flipV;
    
    // 更新预览
    updatePreview();
    
    // 显示弹窗
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * 关闭编辑弹窗
 */
function closeEditorModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * 打开确认对话框
 */
function openConfirm() {
    confirmModal.classList.add('active');
}

/**
 * 关闭确认对话框
 */
function closeConfirm() {
    confirmModal.classList.remove('active');
}

/**
 * 页面加载时恢复保存的变换效果
 */
function initAvatar() {
    const settings = loadSettings();
    avatarImage.style.transform = calculateTransform(
        settings.cropX,
        settings.cropY,
        settings.scale,
        settings.rotate,
        settings.flipH,
        settings.flipV
    );
}

// 事件监听

// 双击头像打开编辑器
avatarContainer.addEventListener('dblclick', openEditor);

// 关闭按钮和遮罩层关闭编辑器
closeEditor.addEventListener('click', closeEditorModal);
modalOverlay.addEventListener('click', closeEditorModal);

// 控制面板输入事件
cropX.addEventListener('input', updatePreview);
cropY.addEventListener('input', updatePreview);
scaleInput.addEventListener('input', updatePreview);
rotateInput.addEventListener('input', updatePreview);

// 水平翻转按钮
flipH.addEventListener('click', () => {
    flipHValue = flipHValue === 1 ? -1 : 1;
    updatePreview();
});

// 垂直翻转按钮
flipV.addEventListener('click', () => {
    flipVValue = flipVValue === 1 ? -1 : 1;
    updatePreview();
});

// 重置按钮
resetAvatar.addEventListener('click', () => {
    resetEditor();
});

// 应用按钮 - 先显示确认对话框
applyAvatar.addEventListener('click', () => {
    openConfirm();
});

// 确认对话框按钮
confirmYes.addEventListener('click', () => {
    applyChanges();
    closeConfirm();
});

confirmNo.addEventListener('click', closeConfirm);
confirmOverlay.addEventListener('click', closeConfirm);

// 页面加载时初始化头像
document.addEventListener('DOMContentLoaded', initAvatar);