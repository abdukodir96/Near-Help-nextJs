'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { useMutation } from '@apollo/client/react';
import {
  AccountCircleOutlined,
  AddCircleOutlineRounded,
  ArticleOutlined,
  EditNoteOutlined,
  FavoriteBorderRounded,
  GroupOutlined,
  HistoryOutlined,
  HomeWorkOutlined,
  ImageOutlined,
  LogoutRounded,
  PersonAddAltOutlined,
  PhoneOutlined,
} from '@mui/icons-material';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/auth/tokens';
import { CREATE_ARTICLE, UPLOAD_IMAGE } from '@/lib/graphql/queries';
import { BACKEND_URL } from '@/lib/config/env';
import styles from './write-article-page.module.scss';

const CATEGORIES = [
  { value: 'FREE',      label: 'Free' },
  { value: 'RECOMMEND', label: 'Recommend' },
  { value: 'NEWS',      label: 'News' },
  { value: 'HUMOR',     label: 'Humor' },
];

const sidebarSections = [
  {
    title: 'Manage Listings',
    items: [
      { label: 'Add Service',      href: '/mypage/services/new', Icon: AddCircleOutlineRounded },
      { label: 'My Services',      href: '/mypage/services',     Icon: HomeWorkOutlined },
      { label: 'My Favorites',     href: '/mypage/favorites',    Icon: FavoriteBorderRounded },
      { label: 'Recently Visited', href: '/mypage/recent',       Icon: HistoryOutlined },
      { label: 'My Followers',     href: '/mypage/followers',    Icon: GroupOutlined },
      { label: 'My Followings',    href: '/mypage/followings',   Icon: PersonAddAltOutlined },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Articles',      href: '/mypage/articles',   Icon: ArticleOutlined },
      { label: 'Write Article', href: '/blog/write',   Icon: EditNoteOutlined },
    ],
  },
  {
    title: 'Manage Account',
    items: [
      { label: 'My Profile', href: '/mypage', Icon: AccountCircleOutlined },
      { label: 'Logout',     href: null,      Icon: LogoutRounded, isLogout: true },
    ],
  },
];

const defaultProfile = {
  name:  'Martin',
  phone: '01024694424',
  role:  'AGENT',
  image: '/theme/images/team/2.jpg',
};

export const WriteArticlePage = () => {
  const router   = useRouter();
  const pathname = usePathname();

  const [category, setCategory] = useState('FREE');
  const [title,    setTitle]    = useState('');
  const [content,  setContent]  = useState('');

  // Image upload state
  const [imageUrl,      setImageUrl]      = useState<string | null>(null); // relative path for backend
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // full URL for display
  const [imageName,     setImageName]     = useState<string | null>(null);
  const [imgUploading,  setImgUploading]  = useState(false);
  const imgInputRef = useRef<HTMLInputElement | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [createArticle, { loading }]   = useMutation<any>(CREATE_ARTICLE);
  const [uploadImage]                  = useMutation<{ uploadSingleImage: { url: string; filename: string } }>(UPLOAD_IMAGE);

  const handleLogout = async () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    await Swal.fire({ icon: 'success', title: 'Logged out', confirmButtonColor: '#0052da' });
    router.push('/auth/login');
  };

  const applyFormat = (tag: string) => {
    const before = tag === 'ul' ? '\n- ' : tag === 'ol' ? '\n1. ' : `**`;
    setContent((prev) => prev + before);
  };

  // ── Image upload ────────────────────────────────────────────────────────────

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!Cookies.get(ACCESS_TOKEN_KEY)) {
      await Swal.fire({ icon: 'warning', title: 'Login required', text: 'Please log in to upload images.', confirmButtonColor: '#0052da' });
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      await Swal.fire({ icon: 'error', title: 'Invalid format', text: 'Please upload JPG, PNG or WebP.', confirmButtonColor: '#0052da' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      await Swal.fire({ icon: 'error', title: 'File too large', text: 'Max file size is 5 MB.', confirmButtonColor: '#0052da' });
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setImagePreviewUrl(localPreview);
    setImageName(file.name);
    setImgUploading(true);

    try {
      const result = await uploadImage({ variables: { file } });

      if (result.data?.uploadSingleImage?.url) {
        const data = result.data;
        const relativePath = data.uploadSingleImage.url; // e.g. /uploads/images/.../file.jpg
        setImageUrl(relativePath);                        // send to backend as-is
        setImagePreviewUrl(`${BACKEND_URL}${relativePath}`); // show in browser
      } else {
        throw new Error('Upload returned no URL');
      }
    } catch (err: unknown) {
      setImagePreviewUrl(null);
      setImageName(null);
      URL.revokeObjectURL(localPreview);
      const msg = err instanceof Error ? err.message : 'Could not upload image. Try again.';
      await Swal.fire({ icon: 'error', title: 'Upload failed', text: msg, confirmButtonColor: '#0052da' });
    } finally {
      setImgUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreviewUrl(null);
    setImageUrl(null);
    setImageName(null);
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!Cookies.get(ACCESS_TOKEN_KEY)) {
      await Swal.fire({
        icon: 'warning',
        title: 'Login required',
        confirmButtonColor: '#0052da',
        confirmButtonText: 'Go to Login',
      }).then((r) => { if (r.isConfirmed) router.push('/auth/login'); });
      return;
    }

    if (!title.trim() || title.trim().length < 3) {
      await Swal.fire({ icon: 'warning', title: 'Title too short', text: 'Title must be at least 3 characters.', confirmButtonColor: '#0052da' });
      return;
    }

    if (!content.trim() || content.trim().length < 3) {
      await Swal.fire({ icon: 'warning', title: 'Content too short', text: 'Content must be at least 3 characters.', confirmButtonColor: '#0052da' });
      return;
    }

    try {
      const { data } = await createArticle({
        variables: {
          input: {
            articleCategory: category,
            articleTitle:    title.trim(),
            articleContent:  content.trim(),
            ...(imageUrl ? { articleImage: imageUrl } : {}),
          },
        },
      });

      if (data?.createArticle) {
        await Swal.fire({
          icon: 'success',
          title: 'Article published!',
          text: `"${title}" has been successfully published.`,
          confirmButtonColor: '#0052da',
          timer: 2000,
          showConfirmButton: false,
        });
        router.push('/blog');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to publish. Please try again.';
      await Swal.fire({ icon: 'error', title: 'Publish failed', text: msg, confirmButtonColor: '#0052da' });
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.heading}>
          <h1>Write An Article</h1>
          <p>Feel free to write your ideas!</p>
        </div>

        <div className={styles.layout}>
          {/* ── Sidebar ── */}
          <aside className={styles.sidebarCard}>
            <div className={styles.profileSummary}>
              <div className={styles.avatarWrap}>
                <Image src={defaultProfile.image} alt={defaultProfile.name} fill sizes="56px" className={styles.avatar} />
              </div>
              <div>
                <p className={styles.profileName}>{defaultProfile.name}</p>
                <p className={styles.profilePhone}>
                  <PhoneOutlined fontSize="small" />
                  {defaultProfile.phone}
                </p>
                <span className={styles.roleBadge}>{defaultProfile.role}</span>
              </div>
            </div>

            {sidebarSections.map((section) => (
              <div key={section.title} className={styles.sideSection}>
                <h3>{section.title}</h3>
                <div className={styles.sideMenu}>
                  {section.items.map((item) => {
                    const { Icon } = item;
                    const isActive = item.href ? pathname === item.href : false;

                    if (item.isLogout) {
                      return (
                        <button key={item.label} type="button" onClick={handleLogout} className={styles.sideAction}>
                          <Icon fontSize="small" />
                          {item.label}
                        </button>
                      );
                    }

                    return (
                      <Link key={item.label} href={item.href!} className={`${styles.sideLink} ${isActive ? styles.sideLinkActive : ''}`}>
                        <Icon fontSize="small" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </aside>

          {/* ── Form ── */}
          <div className={styles.formCard}>
            {/* Category + Title */}
            <div className={styles.formTop}>
              <div className={styles.fieldCol}>
                <label>Category</label>
                <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.fieldCol}>
                <label>Title</label>
                <input
                  type="text"
                  className={styles.titleInput}
                  placeholder="Type Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={80}
                />
              </div>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
              <button type="button" className={styles.toolBtn} title="Heading" onClick={() => setContent((p) => p + '\n# ')}>H</button>
              <button type="button" className={styles.toolBtn} title="Bold" onClick={() => setContent((p) => p + '**bold**')}><b>B</b></button>
              <button type="button" className={styles.toolBtn} title="Italic" onClick={() => setContent((p) => p + '*italic*')}><i>I</i></button>
              <button type="button" className={styles.toolBtn} title="Strikethrough" onClick={() => setContent((p) => p + '~~text~~')}><s>S</s></button>
              <span className={styles.toolbarDivider} />
              <button type="button" className={styles.toolBtn} title="Table">⊞</button>
              <button type="button" className={styles.toolBtn} title="Link" onClick={() => setContent((p) => p + '[text](url)')}>🔗</button>
              <span className={styles.toolbarDivider} />
              <button type="button" className={styles.toolBtn} title="Bullet list" onClick={() => applyFormat('ul')}>☰</button>
              <button type="button" className={styles.toolBtn} title="Ordered list" onClick={() => applyFormat('ol')}>≡</button>
              <button type="button" className={styles.toolBtn} title="Checkbox" onClick={() => setContent((p) => p + '\n- [ ] ')}>☐</button>
              <span className={styles.toolbarDivider} />

              {/* Image upload button */}
              <input
                ref={imgInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={handleImageSelect}
              />
              <button
                type="button"
                className={styles.imgUploadBtn}
                title="Upload image"
                disabled={imgUploading || !!imageUrl}
                onClick={() => imgInputRef.current?.click()}
              >
                <ImageOutlined fontSize="small" />
                {imageUrl ? 'Image added' : 'Add Image'}
              </button>
            </div>

            {/* Image uploading indicator */}
            {imgUploading && (
              <div className={styles.imgUploading}>Uploading image...</div>
            )}

            {/* Image preview */}
            {imagePreviewUrl && !imgUploading && (
              <div className={styles.imagePreview}>
                <div className={styles.imagePreviewThumb}>
                  <Image
                    src={imagePreviewUrl}
                    alt="preview"
                    fill
                    sizes="120px"
                    style={{ objectFit: 'cover' }}
                    unoptimized
                  />
                </div>
                <div className={styles.imagePreviewInfo}>
                  <span className={styles.imagePreviewLabel}>Article image</span>
                  <span className={styles.imagePreviewName}>{imageName}</span>
                  {imageUrl && <span className={styles.imagePreviewLabel} style={{ color: '#16a34a' }}>✓ Uploaded</span>}
                </div>
                <button type="button" className={styles.imageRemoveBtn} onClick={removeImage} title="Remove image">×</button>
              </div>
            )}

            {/* Content */}
            <textarea
              className={styles.contentArea}
              placeholder="Type here"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={2500}
            />

            {/* Footer */}
            <div className={styles.formFooter}>
              <button type="button" className={styles.submitBtn} disabled={loading || imgUploading} onClick={handleSubmit}>
                {loading ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
