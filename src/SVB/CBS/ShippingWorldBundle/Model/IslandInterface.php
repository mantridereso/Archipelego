<?php
namespace SVB\CBS\ShippingWorldBundle\Model;

/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 21.09.15
 * Time: 17:04
 */

/**
 * Interface IslandInterface
 * @package SVB\CBS\ShippingWorldBundle\Model
 */
interface IslandInterface
{

    /**
     * @return string
     */
    public function getName();

    /**
     * @return WorldInterface
     */
    public function getWorld();

    /**
     * @return string
     */
    public function getNativeLanguage();

    /**
     * @return VillageInterface[]
     */
    public function getVillages();

    /**
     * @return VillageInterface
     */
    public function getCapital();

    /**
     * @return int
     */
    public function getPositionX();

    /**
     * @return int
     */
    public function getPositionY();

    /**
     * @return int
     */
    public function getExtent();

    /**
     * @return int
     */
    public function getGestalt();

    /**
     * @return array
     */
    public function export();

}