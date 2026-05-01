'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AccountCircleOutlined,
  AddCircleOutlineRounded,
  ArticleOutlined,
  CloudUploadOutlined,
  EditNoteOutlined,
  FavoriteBorderRounded,
  GroupOutlined,
  HistoryOutlined,
  HomeWorkOutlined,
  LogoutRounded,
  PersonAddAltOutlined,
  PhoneOutlined,
} from '@mui/icons-material';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { type ChangeEvent, type DragEvent, useEffect, useRef, useState } from 'react';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/lib/auth/tokens';
import {
  serviceItems,
  serviceTypeOptions,
  locationOptions,
  serviceOptionChoices,
  type ServiceOption,
  type ServiceLocation,
} from '@/components/services/services-data';
import styles from './my-service-form.module.scss';

type ServiceStatus = 'ACTIVE' | 'INACTIVE';

type SidebarItem = {
  label: string;
  href?: string;
  icon: typeof AddCircleOutlineRounded;
  action?: 'logout';
};

type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

const defaultProfile = {
  name: 'Martin',
  phone: '01024694424',
  role: 'AGENT',
  image: '/theme/images/team/2.jpg',
};

const sidebarSections: SidebarSection[] = [
  {
    title: 'Manage Services',
    items: [
      { label: 'Add Service', href: '/mypage/services/new', icon: AddCircleOutlineRounded },
      { label: 'My Services', href: '/mypage/services', icon: HomeWorkOutlined },
      { label: 'My Favorites', href: '/mypage/favorites', icon: FavoriteBorderRounded },
      { label: 'Recently Visited', href: '/mypage/recent', icon: HistoryOutlined },
      { label: 'My Followers', href: '/mypage/followers', icon: GroupOutlined },
      { label: 'My Followings', href: '/mypage/followings', icon: PersonAddAltOutlined },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Articles', href: '/mypage/articles', icon: ArticleOutlined },
      { label: 'Write Article', href: '/blog', icon: EditNoteOutlined },
    ],
  },
  {
    title: 'Manage Account',
    items: [
      { label: 'My Profile', href: '/mypage', icon: AccountCircleOutlined },
      { label: 'Logout', icon: LogoutRounded, action: 'logout' },
    ],
  },
];

type FormState = {
  title: string;
  priceLabel: string;
  category: string;
  responseTime: string;
  description: string;
  locations: ServiceLocation[];
  options: ServiceOption[];
  status: ServiceStatus;
};

const emptyForm: FormState = {
  title: '',
  priceLabel: '',
  category: serviceTypeOptions[0],
  responseTime: '',
  description: '',
  locations: [],
  options: [],
  status: 'ACTIVE',
};

export const MyServiceForm = ({ slug }: { slug?: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isEditMode = Boolean(slug);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (!slug) return;
    const found = serviceItems.find((s) => s.slug === slug);
    if (!found) return;
    setForm({
      title: found.title,
      priceLabel: found.priceLabel,
      category: found.category,
      responseTime: found.responseTime,
      description: found.description,
      locations: [...found.locations],
      options: [...found.options],
      status: 'ACTIVE',
    });
    setPreviews([found.image]);
  }, [slug]);

  const handleLogout = async () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    await Swal.fire({
      icon: 'success',
      title: 'Logged out',
      text: 'You have been logged out successfully.',
      confirmButtonColor: '#0052da',
    });
    router.push('/auth/login');
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleLocation = (loc: ServiceLocation) => {
    setForm((prev) => ({
      ...prev,
      locations: prev.locations.includes(loc)
        ? prev.locations.filter((l) => l !== loc)
        : [...prev.locations, loc],
    }));
  };

  const toggleOption = (opt: ServiceOption) => {
    setForm((prev) => ({
      ...prev,
      options: prev.options.includes(opt)
        ? prev.options.filter((o) => o !== opt)
        : [...prev.options, opt],
    }));
  };

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files)
      .filter((f) => ['image/jpeg', 'image/png'].includes(f.type))
      .map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...urls]);
  };

  const handleFilePick = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.priceLabel.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Missing fields',
        text: 'Please fill in the title and price before saving.',
        confirmButtonColor: '#0052da',
      });
      return;
    }

    await Swal.fire({
      icon: 'success',
      title: isEditMode ? 'Service updated' : 'Service added',
      text: isEditMode
        ? 'Your changes have been saved successfully.'
        : 'Your new service has been added successfully.',
      confirmButtonColor: '#0052da',
    });

    router.push('/mypage/services');
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.wrapper}>
          <header className={styles.hero}>
            <h1>{isEditMode ? 'Edit Service' : 'Add New Service'}</h1>
            <p>We are glad to see you again!</p>
          </header>

          <div className={styles.contentGrid}>
            {/* Sidebar */}
            <aside className={styles.sidebarCard}>
              <div className={styles.profileSummary}>
                <div className={styles.summaryAvatarWrap}>
                  <Image src={defaultProfile.image} alt={defaultProfile.name} fill sizes="106px" className={styles.summaryAvatar} />
                </div>
                <div className={styles.summaryInfo}>
                  <h2>{defaultProfile.name}</h2>
                  <div className={styles.summaryPhone}>
                    <PhoneOutlined fontSize="small" />
                    <span>{defaultProfile.phone}</span>
                  </div>
                  <span className={styles.roleBadge}>{defaultProfile.role}</span>
                </div>
              </div>

              <div className={styles.sidebarSections}>
                {sidebarSections.map((section) => (
                  <div key={section.title} className={styles.sidebarSection}>
                    <h3>{section.title}</h3>
                    <div className={styles.sidebarMenu}>
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.href ? pathname === item.href : false;

                        if (item.action === 'logout') {
                          return (
                            <button key={item.label} type="button" onClick={handleLogout} className={styles.sidebarAction}>
                              <span className={styles.sidebarLinkMain}>
                                <span className={styles.sidebarActionIcon}><Icon fontSize="small" /></span>
                                <span>{item.label}</span>
                              </span>
                            </button>
                          );
                        }

                        return (
                          <Link key={item.label} href={item.href ?? '/mypage'} className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}>
                            <span className={styles.sidebarLinkMain}>
                              <span className={styles.sidebarLinkIcon}><Icon fontSize="small" /></span>
                              <span>{item.label}</span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* Form */}
            <section className={styles.mainCard}>
              <form onSubmit={handleSave}>
                {/* Basic fields */}
                <div className={styles.formSection}>
                  <div className={styles.fullRow}>
                    <label className={styles.field}>
                      <span>Title</span>
                      <input type="text" name="title" value={form.title} onChange={handleTextChange} placeholder="e.g. Emergency Plumbing" />
                    </label>
                  </div>

                  <div className={styles.twoCol}>
                    <label className={styles.field}>
                      <span>Price</span>
                      <input type="text" name="priceLabel" value={form.priceLabel} onChange={handleTextChange} placeholder="e.g. ₩180k - ₩420k" />
                    </label>
                    <label className={styles.field}>
                      <span>Category</span>
                      <div className={styles.selectWrap}>
                        <select name="category" value={form.category} onChange={handleTextChange}>
                          {serviceTypeOptions.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </label>
                  </div>

                  <div className={styles.twoCol}>
                    <label className={styles.field}>
                      <span>Response Time</span>
                      <input type="text" name="responseTime" value={form.responseTime} onChange={handleTextChange} placeholder="e.g. Same day / emergency dispatch" />
                    </label>
                    {isEditMode && (
                      <label className={styles.field}>
                        <span>Status</span>
                        <div className={styles.selectWrap}>
                          <select name="status" value={form.status} onChange={handleTextChange}>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                          </select>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Locations */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Locations</h3>
                  <div className={styles.checkGrid}>
                    {locationOptions.map((loc) => (
                      <label key={loc} className={styles.checkItem}>
                        <input
                          type="checkbox"
                          checked={form.locations.includes(loc)}
                          onChange={() => toggleLocation(loc)}
                        />
                        <span>{loc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Service Options */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Service Options</h3>
                  <div className={styles.checkRow}>
                    {serviceOptionChoices.map((opt) => (
                      <label key={opt} className={styles.checkItem}>
                        <input
                          type="checkbox"
                          checked={form.options.includes(opt)}
                          onChange={() => toggleOption(opt)}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Service Description</h3>
                  <label className={styles.field}>
                    <span>Description</span>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleTextChange}
                      rows={5}
                      placeholder="Describe the service in detail..."
                    />
                  </label>
                </div>

                {/* Image upload */}
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Upload service images</h3>
                  <div
                    className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                  >
                    <CloudUploadOutlined className={styles.dropIcon} />
                    <p className={styles.dropTitle}>Drag and drop images here</p>
                    <p className={styles.dropHint}>Photos must be JPEG or PNG format</p>
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png" multiple hidden onChange={handleFilePick} />
                    <button type="button" className={styles.browseBtn} onClick={() => fileInputRef.current?.click()}>
                      Browse Files
                    </button>
                  </div>

                  {previews.length > 0 && (
                    <div className={styles.previewGrid}>
                      {previews.map((src, i) => (
                        <div key={i} className={styles.previewItem}>
                          <Image src={src} alt={`Preview ${i + 1}`} fill sizes="140px" className={styles.previewImg} unoptimized={src.startsWith('blob:')} />
                          <button type="button" className={styles.removePreview} onClick={() => removePreview(i)} aria-label="Remove image">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Save */}
                <div className={styles.saveRow}>
                  <button type="submit" className={styles.saveBtn}>Save</button>
                </div>
              </form>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
};
